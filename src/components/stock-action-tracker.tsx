

"use client";

import type { ChangeEvent } from 'react';
import React, { useState, useEffect, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import {
  Landmark,
  Scissors,
  ReplaceAll,
  Users2,
  HelpCircle,
  Download,
  Search,
  CalendarDays,
  RotateCcw,
  Info,
} from 'lucide-react';

import { mockStockActions } from '@/lib/mock-data';
import type { StockAction, StockActionType } from '@/types';
import { ALL_ACTION_TYPES } from '@/types';
import { exportToCSV } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Dictionary } from '@/lib/dictionaries';

const getActionTypeIcon = (actionType: StockActionType) => {
  const iconColor = "text-[hsl(var(--chart-2))]";
  switch (actionType) {
    case 'Dividend':
      return <Landmark className={`h-5 w-5 ${iconColor}`} />;
    case 'Stock Split':
      return <Scissors className={`h-5 w-5 ${iconColor}`} />;
    case 'Ticker Change':
      return <ReplaceAll className={`h-5 w-5 ${iconColor}`} />;
    case 'Merger':
      return <Users2 className={`h-5 w-5 ${iconColor}`} />;
    case 'Other':
      return <HelpCircle className={`h-5 w-5 ${iconColor}`} />;
    default:
      return <Info className="h-5 w-5 text-muted-foreground" />;
  }
};

const ALL_TYPES_VALUE = "all";

// Sort initial actions by announcementDate descending
const sortedMockActions = [...mockStockActions].sort(
  (a, b) => new Date(b.announcementDate).getTime() - new Date(a.announcementDate).getTime()
);

// Get IDs of the newest 3 actions
const newestActionIds = sortedMockActions.slice(0, 3).map(action => action.id);

const ITEMS_PER_PAGE = 5;

interface StockActionTrackerProps {
  dictionary: Dictionary['stockTracker'];
  actionTypeDictionary: Dictionary['actionTypes'];
}

export default function StockActionTracker({ dictionary, actionTypeDictionary }: StockActionTrackerProps) {
  const [actions] = useState<StockAction[]>(sortedMockActions);
  const [filteredActions, setFilteredActions] = useState<StockAction[]>(sortedMockActions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionType, setSelectedActionType] = useState<StockActionType | ''>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    let currentActions = [...actions];

    if (searchTerm) {
      currentActions = currentActions.filter(
        (action) =>
          action.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          action.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedActionType) {
      currentActions = currentActions.filter(
        (action) => action.actionType === selectedActionType
      );
    }

    if (dateRange?.from) {
      currentActions = currentActions.filter((action) => {
        const effectiveDate = new Date(action.effectiveDate);
        return effectiveDate >= new Date(dateRange.from as Date);
      });
    }
    if (dateRange?.to) {
      currentActions = currentActions.filter((action) => {
        const effectiveDate = new Date(action.effectiveDate);
        const toDate = new Date(dateRange.to as Date);
        toDate.setHours(23, 59, 59, 999); // Include the whole 'to' day
        return effectiveDate <= toDate;
      });
    }
    
    // Simulate loading delay
    setTimeout(() => {
      setFilteredActions(currentActions);
      setCurrentPage(1); // Reset to first page when filters change
      setIsLoading(false);
    }, 300);

  }, [actions, searchTerm, selectedActionType, dateRange]);

  const totalPages = Math.ceil(filteredActions.length / ITEMS_PER_PAGE);
  const paginatedActions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredActions.slice(startIndex, endIndex);
  }, [filteredActions, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleExportCSV = () => {
    if (filteredActions.length === 0) {
      toast({
        title: dictionary.toastNoDataTitle,
        description: dictionary.toastNoDataDescription,
        variant: "destructive",
      });
      return;
    }
    const dataToExport = filteredActions.map(({ id, ...rest }) => rest); 
    const filenameBase = `stock_actions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    exportToCSV(dataToExport, filenameBase);
    toast({
      title: dictionary.toastExportSuccessTitle,
      description: dictionary.toastExportSuccessDescription.replace('{filename}', filenameBase),
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedActionType('');
    setDateRange(undefined);
    // useEffect will handle resetting page and actions
  };
  
  const displayDateRange = useMemo(() => {
    if (!dateRange?.from) return dictionary.selectDateRange;
    if (!dateRange.to) return format(dateRange.from, "LLL dd, y");
    return `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`;
  }, [dateRange, dictionary.selectDateRange]);

  const handleActionTypeChange = (value: string) => {
    if (value === ALL_TYPES_VALUE) {
      setSelectedActionType('');
    } else {
      setSelectedActionType(value as StockActionType);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 pt-6">
          <div className="space-y-1">
            <label htmlFor="search-ticker" className="text-sm font-medium">{dictionary.searchLabel}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-ticker"
                type="text"
                placeholder={dictionary.searchPlaceholder}
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="action-type" className="text-sm font-medium">{dictionary.actionTypeLabel}</label>
            <Select
              value={selectedActionType === '' ? ALL_TYPES_VALUE : selectedActionType}
              onValueChange={handleActionTypeChange}
            >
              <SelectTrigger id="action-type" className="w-full">
                <SelectValue placeholder={dictionary.allActionTypes} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_TYPES_VALUE}>{dictionary.allActionTypes}</SelectItem>
                {ALL_ACTION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {actionTypeDictionary[type as StockActionType]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label htmlFor="effective-date" className="text-sm font-medium">{dictionary.dateRangeLabel}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="effective-date"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {displayDateRange}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-end space-x-2">
            <Button onClick={handleClearFilters} variant="outline" className="w-full md:w-auto">
              <RotateCcw className="mr-2 h-4 w-4" /> {dictionary.clearFiltersButton}
            </Button>
            <Button onClick={handleExportCSV} className="w-full md:w-auto bg-primary hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" /> {dictionary.exportCSVButton}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" aria-label={dictionary.loadingSpinnerText}></div>
            </div>
          ) : paginatedActions.length > 0 ? (
            <TooltipProvider>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">{dictionary.tableHeaderAnnounceDate}</TableHead>
                      <TableHead className="whitespace-nowrap">{dictionary.tableHeaderActionType}</TableHead>
                      <TableHead className="whitespace-nowrap">{dictionary.tableHeaderTicker}</TableHead>
                      <TableHead className="whitespace-nowrap">{dictionary.tableHeaderCompanyName}</TableHead>
                      <TableHead className="whitespace-nowrap">{dictionary.tableHeaderDetails}</TableHead>
                      <TableHead className="whitespace-nowrap">{dictionary.tableHeaderEffectiveDate}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedActions.map((action) => (
                      <TableRow key={action.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center">
                            <span>{action.announcementDate}</span>
                            {newestActionIds.includes(action.id) && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="default" className="ml-2 cursor-default bg-[hsl(var(--chart-5))] text-primary-foreground">{dictionary.newTag}</Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{dictionary.newTagTooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getActionTypeIcon(action.actionType)}
                            {actionTypeDictionary[action.actionType as StockActionType]}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-primary">
                          {action.ticker}
                        </TableCell>
                        <TableCell>{action.companyName}</TableCell>
                        <TableCell>{action.actionDetails}</TableCell>
                        <TableCell className="whitespace-nowrap">{action.effectiveDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    variant="outline"
                  >
                    {dictionary.previousPage}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {dictionary.pageIndicator
                      .replace('{currentPage}', currentPage.toString())
                      .replace('{totalPages}', totalPages.toString())}
                  </span>
                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                  >
                    {dictionary.nextPage}
                  </Button>
                </div>
              )}
            </TooltipProvider>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Info className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg">{dictionary.noActionsFound}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
