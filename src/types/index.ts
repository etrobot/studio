
export type HoldingActionType = 'Bonus Issue' | 'Stock Split/Consolidation' | 'Ticker Change';
export const HOLDING_ACTION_TYPES: HoldingActionType[] = ['Bonus Issue', 'Stock Split/Consolidation', 'Ticker Change'];

export type LookupActionType = 'Cash Dividend' | 'Bonus Issue' | 'Stock Split/Consolidation' | 'Ticker Change' | 'Shareholder Meeting' | 'Board Transfer' | 'Trading Status Change';
export const LOOKUP_ACTION_TYPES: LookupActionType[] = ['Cash Dividend', 'Bonus Issue', 'Stock Split/Consolidation', 'Ticker Change', 'Shareholder Meeting', 'Board Transfer', 'Trading Status Change'];

export type StockActionType = 'Cash Dividend' | 'Bonus Issue' | 'Stock Split/Consolidation' | 'Ticker Change' | 'Shareholder Meeting' | 'Board Transfer' | 'Trading Status Change';

export interface StockAction {
  id: string;
  announcementDate: string; // YYYY-MM-DD
  ticker: string;
  companyName: string;
  actionType: StockActionType;
  actionDetails: string;
  effectiveDate: string; // YYYY-MM-DD
  before?: string;
  after?: string;
}
