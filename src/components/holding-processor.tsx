
"use client";

import type { ChangeEvent } from 'react';
import React, { useState, useEffect, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import Link from 'next/link';
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
  ChevronRight,
  CheckCircle2,
  Settings,
  ArrowUpDown,
} from 'lucide-react';

import { mockStockActions, mockCompletedActions } from '@/lib/mock-data';
import type { StockAction, HoldingActionType } from '@/types';
import { HOLDING_ACTION_TYPES } from '@/types';
import { exportToCSV, cn } from '@/lib/utils';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Dictionary } from '@/lib/dictionaries';
import { usePathname } from 'next/navigation';

const getActionTypeIcon = (actionType: HoldingActionType) => {
  const iconColor = "text-[hsl(var(--chart-2))]";
  switch (actionType) {
    case 'Bonus Issue':
      return <Landmark className={`h-5 w-5 ${iconColor}`} />;
    case 'Stock Split/Consolidation':
      return <Scissors className={`h-5 w-5 ${iconColor}`} />;
    case 'Ticker Change':
      return <ReplaceAll className={`h-5 w-5 ${iconColor}`} />;
    default:
      return <Info className="h-5 w-5 text-muted-foreground" />;
  }
};

const ALL_TYPES_VALUE = "all";

type SortableKeys = 'announcementDate' | 'effectiveDate';
type SortDirection = 'ascending' | 'descending';

interface HoldingProcessorProps {
  dictionary: Dictionary['stockTracker'];
  actionTypeDictionary: Dictionary['actionTypes'];
  holdingDictionary: Dictionary['holdingProcessor'];
}

export default function HoldingProcessor({ dictionary, actionTypeDictionary, holdingDictionary }: HoldingProcessorProps) {
  const [actions] = useState<StockAction[]>([...mockStockActions.filter(a => HOLDING_ACTION_TYPES.includes(a.actionType as HoldingActionType))]);
  const [filteredActions, setFilteredActions] = useState<StockAction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionType, setSelectedActionType] = useState<HoldingActionType | ''>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: SortDirection }>({ 
    key: 'announcementDate', 
    direction: 'descending' 
  });
  const { toast } = useToast();
  const pathname = usePathname();
  
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
        const announcementDate = new Date(action.announcementDate);
        return announcementDate >= new Date(dateRange.from as Date);
      });
    }
    if (dateRange?.to) {
      currentActions = currentActions.filter((action) => {
        const announcementDate = new Date(action.announcementDate);
        const toDate = new Date(dateRange.to as Date);
        toDate.setHours(23, 59, 59, 999); // Include the whole 'to' day
        return announcementDate <= toDate;
      });
    }

    // Sorting logic
    currentActions.sort((a, b) => {
        const dateA = new Date(a[sortConfig.key]).getTime();
        const dateB = new Date(b[sortConfig.key]).getTime();
        if (dateA < dateB) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (dateA > dateB) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });
    
    // Simulate loading delay
    setTimeout(() => {
      setFilteredActions(currentActions);
      setIsLoading(false);
    }, 300);

  }, [actions, searchTerm, selectedActionType, dateRange, sortConfig]);

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
    setSortConfig({ key: 'announcementDate', direction: 'descending' });
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
      setSelectedActionType(value as HoldingActionType);
    }
  };

  const requestSort = (key: SortableKeys) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  const renderSortableHeader = (key: SortableKeys, label: string) => (
    <TableHead 
        className="whitespace-nowrap cursor-pointer hover:bg-muted/50"
        onClick={() => requestSort(key)}
    >
        <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown className={cn("h-4 w-4", sortConfig.key === key ? "text-foreground" : "text-muted-foreground")} />
        </div>
    </TableHead>
  );

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
                {HOLDING_ACTION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {actionTypeDictionary[type as HoldingActionType]}
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
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">{holdingDictionary.pendingTab}</TabsTrigger>
          <TabsTrigger value="completed">{holdingDictionary.completedTab}</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card className="shadow-lg mt-4">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" aria-label={dictionary.loadingSpinnerText}></div>
                </div>
              ) : filteredActions.length > 0 ? (
                <TooltipProvider>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {renderSortableHeader('announcementDate', dictionary.tableHeaderAnnounceDate)}
                          <TableHead className="whitespace-nowrap">{dictionary.tableHeaderActionType}</TableHead>
                          <TableHead className="whitespace-nowrap">{dictionary.tableHeaderTicker}</TableHead>
                          <TableHead className="whitespace-nowrap">{dictionary.tableHeaderCompanyName}</TableHead>
                          <TableHead className="whitespace-nowrap">{dictionary.tableHeaderDetails}</TableHead>
                          {renderSortableHeader('effectiveDate', dictionary.tableHeaderEffectiveDate)}
                          <TableHead className="text-center whitespace-nowrap">{holdingDictionary.tableHeaderHoldingDetails}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredActions.map((action) => (
                          <TableRow key={action.id}>
                            <TableCell className="whitespace-nowrap">
                                <span>{action.announcementDate}</span>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getActionTypeIcon(action.actionType as HoldingActionType)}
                                {actionTypeDictionary[action.actionType as HoldingActionType]}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-primary">
                              {action.ticker}
                            </TableCell>
                            <TableCell>{action.companyName}</TableCell>
                            <TableCell>{action.actionDetails}</TableCell>
                            <TableCell className="whitespace-nowrap">{action.effectiveDate}</TableCell>
                            <TableCell className="text-center">
                              <Button asChild variant="default" size="sm">
                                  <Link href={`${pathname}/${action.id}`}>
                                    {holdingDictionary.viewDetailsButton}
                                  </Link>
                                </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TooltipProvider>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <Info className="mx-auto h-12 w-12 mb-4" />
                  <p className="text-lg">{dictionary.noActionsFound}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
           <Card className="shadow-lg mt-4">
              <CardContent className="pt-6">
                {mockCompletedActions.length > 0 ? (
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
                                    <TableHead className="whitespace-nowrap">{holdingDictionary.tableHeaderProcessor}</TableHead>
                                    <TableHead className="whitespace-nowrap">{holdingDictionary.tableHeaderProcessedDate}</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">{holdingDictionary.tableHeaderHoldingDetails}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockCompletedActions.map((action) => (
                                    <TableRow key={action.id}>
                                        <TableCell className="whitespace-nowrap">{action.announcementDate}</TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {getActionTypeIcon(action.actionType as HoldingActionType)}
                                                {actionTypeDictionary[action.actionType as HoldingActionType]}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-primary">{action.ticker}</TableCell>
                                        <TableCell>{action.companyName}</TableCell>
                                        <TableCell>{action.actionDetails}</TableCell>
                                        <TableCell className="whitespace-nowrap">{action.effectiveDate}</TableCell>
                                        <TableCell className="whitespace-nowrap">{action.processor}</TableCell>
                                        <TableCell className="whitespace-nowrap">{action.processedDate}</TableCell>
                                        <TableCell className="text-center">
                                             <Button asChild variant="default" size="sm">
                                                <Link href={`${pathname}/${action.id}`}>
                                                    {holdingDictionary.viewDetailsButton}
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        <CheckCircle2 className="mx-auto h-12 w-12 mb-4" />
                        <p className="text-lg">{holdingDictionary.noCompletedActions}</p>
                    </div>
                )}
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
