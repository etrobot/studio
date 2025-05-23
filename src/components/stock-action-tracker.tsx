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
  Filter as FilterIcon,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const getActionTypeIcon = (actionType: StockActionType) => {
  switch (actionType) {
    case 'Dividend':
      return <Landmark className="h-5 w-5 text-accent" />;
    case 'Stock Split':
      return <Scissors className="h-5 w-5 text-accent" />;
    case 'Ticker Change':
      return <ReplaceAll className="h-5 w-5 text-accent" />;
    case 'Merger':
      return <Users2 className="h-5 w-5 text-accent" />;
    case 'Other':
      return <HelpCircle className="h-5 w-5 text-accent" />;
    default:
      return <Info className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function StockActionTracker() {
  const [actions] = useState<StockAction[]>(mockStockActions);
  const [filteredActions, setFilteredActions] = useState<StockAction[]>(actions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionType, setSelectedActionType] = useState<StockActionType | ''>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
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
        // Adjust 'to' date to include the whole day
        const toDate = new Date(dateRange.to as Date);
        toDate.setHours(23, 59, 59, 999);
        return effectiveDate <= toDate;
      });
    }
    
    // Simulate loading delay
    setTimeout(() => {
      setFilteredActions(currentActions);
      setIsLoading(false);
    }, 300);

  }, [actions, searchTerm, selectedActionType, dateRange]);

  const handleExportCSV = () => {
    if (filteredActions.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to export.",
        variant: "destructive",
      });
      return;
    }
    const dataToExport = filteredActions.map(({ id, ...rest }) => rest); // Exclude ID from export
    const filename = `stock_actions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    exportToCSV(dataToExport, filename);
    toast({
      title: "Export Successful",
      description: `${filename} has been downloaded.`,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedActionType('');
    setDateRange(undefined);
  };
  
  const displayDateRange = useMemo(() => {
    if (!dateRange?.from) return "Select date range";
    if (!dateRange.to) return format(dateRange.from, "LLL dd, y");
    return `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`;
  }, [dateRange]);

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Stock Action Tracker</CardTitle>
        </CardHeader>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FilterIcon className="h-6 w-6 text-primary" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <label htmlFor="search-ticker" className="text-sm font-medium">Search Ticker/Company</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-ticker"
                type="text"
                placeholder="e.g., AAPL or Apple"
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="action-type" className="text-sm font-medium">Action Type</label>
            <Select
              value={selectedActionType}
              onValueChange={(value: StockActionType | '') => setSelectedActionType(value)}
            >
              <SelectTrigger id="action-type" className="w-full">
                <SelectValue placeholder="All Action Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Action Types</SelectItem>
                {ALL_ACTION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label htmlFor="effective-date" className="text-sm font-medium">Effective Date Range</label>
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
              <RotateCcw className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
            <Button onClick={handleExportCSV} className="w-full md:w-auto bg-primary hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Corporate Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredActions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Announce Date</TableHead>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Action Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Before</TableHead>
                    <TableHead>After</TableHead>
                    <TableHead>Effective Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>{action.announcementDate}</TableCell>
                      <TableCell className="font-medium text-primary">{action.ticker}</TableCell>
                      <TableCell>{action.companyName}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getActionTypeIcon(action.actionType)}
                        {action.actionType}
                      </TableCell>
                      <TableCell>{action.actionDetails}</TableCell>
                      <TableCell>{action.valueBefore || 'N/A'}</TableCell>
                      <TableCell>{action.valueAfter || 'N/A'}</TableCell>
                      <TableCell>{action.effectiveDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Info className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg">No actions found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
