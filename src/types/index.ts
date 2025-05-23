export type StockActionType = 'Dividend' | 'Stock Split' | 'Ticker Change' | 'Merger' | 'Other';

export const ALL_ACTION_TYPES: StockActionType[] = ['Dividend', 'Stock Split', 'Ticker Change', 'Merger', 'Other'];

export interface StockAction {
  id: string;
  announcementDate: string; // YYYY-MM-DD
  ticker: string;
  companyName: string;
  actionType: StockActionType;
  actionDetails: string;
  valueBefore?: string | number;
  valueAfter?: string | number;
  effectiveDate: string; // YYYY-MM-DD
}
