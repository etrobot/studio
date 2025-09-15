
import type { StockAction } from '@/types';

export const mockStockActions: StockAction[] = [
  {
    id: '1',
    announcementDate: '2024-07-01',
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    actionType: 'Cash Dividend',
    actionDetails: 'Quarterly cash dividend of $0.25 per share.',
    effectiveDate: '2024-07-15',
  },
  {
    id: '2',
    announcementDate: '2024-06-15',
    ticker: 'MSFT',
    companyName: 'Microsoft Corp.',
    actionType: 'Cash Dividend',
    actionDetails: 'Quarterly cash dividend of $0.68 per share.',
    effectiveDate: '2024-07-01',
  },
  {
    id: '3',
    announcementDate: '2024-05-20',
    ticker: 'GOOGL',
    companyName: 'Alphabet Inc.',
    actionType: 'Stock Split/Consolidation',
    actionDetails: '20-for-1 stock split.',
    effectiveDate: '2024-06-10',
    before: '1 share',
    after: '20 shares',
  },
  {
    id: '4',
    announcementDate: '2024-07-05',
    ticker: 'TSLA',
    companyName: 'Tesla, Inc.',
    actionType: 'Shareholder Meeting',
    actionDetails: 'Vote on CEO compensation package.',
    effectiveDate: '2024-08-01',
  },
  {
    id: '5',
    announcementDate: '2024-04-10',
    ticker: 'FB',
    companyName: 'Meta Platforms, Inc.',
    actionType: 'Ticker Change',
    actionDetails: 'Company changed ticker from FB to META.',
    effectiveDate: '2024-05-01',
    before: 'FB',
    after: 'META',
  },
  {
    id: '6',
    announcementDate: '2024-03-01',
    ticker: 'AMZN',
    companyName: 'Amazon.com, Inc.',
    actionType: 'Stock Split/Consolidation',
    actionDetails: '3-for-1 stock split.',
    effectiveDate: '2024-03-20',
    before: '1 share',
    after: '3 shares',
  },
  {
    id: '7',
    announcementDate: '2024-07-10',
    ticker: 'NVDA',
    companyName: 'NVIDIA Corporation',
    actionType: 'Cash Dividend',
    actionDetails: 'Quarterly cash dividend of $0.04 per share (post-split).',
    effectiveDate: '2024-07-25',
  },
  {
    id: '8',
    announcementDate: '2024-02-15',
    ticker: 'OLDCO',
    companyName: 'Old Company Inc.',
    actionType: 'Board Transfer',
    actionDetails: 'Transferred from NASDAQ to Pink Sheets.',
    effectiveDate: '2024-03-30',
    before: 'NASDAQ',
    after: 'PINK',
  },
  {
    id: '9',
    announcementDate: '2024-07-18',
    ticker: 'BRK.A',
    companyName: 'Berkshire Hathaway Inc.',
    actionType: 'Shareholder Meeting',
    actionDetails: 'Annual shareholder meeting highlights.',
    effectiveDate: '2024-07-18',
  },
  {
    id: '10',
    announcementDate: '2024-01-05',
    ticker: 'SPCE',
    companyName: 'Virgin Galactic Holdings',
    actionType: 'Stock Split/Consolidation',
    actionDetails: '1-for-20 reverse stock split.',
    effectiveDate: '2024-01-20',
    before: '20 shares',
    after: '1 share',
  },
  {
    id: '11',
    announcementDate: '2024-07-22',
    ticker: 'JPM',
    companyName: 'JPMorgan Chase & Co.',
    actionType: 'Bonus Issue',
    actionDetails: '1-for-10 bonus share issue.',
    effectiveDate: '2024-08-05',
  },
  {
    id: '12',
    announcementDate: '2024-07-25',
    ticker: 'SUSP',
    companyName: 'Suspended Corp',
    actionType: 'Trading Status Change',
    actionDetails: 'Trading suspended due to regulatory inquiry.',
    effectiveDate: '2024-07-26',
    before: 'Normal',
    after: 'Suspended',
  }
];


export const mockCompletedActions: (StockAction & { processor: string; processedDate: string; remarks: string })[] = [
    {
        ...mockStockActions.find(a => a.id === '5')!, // Meta Ticker Change
        processor: 'Admin A',
        processedDate: '2024-05-02',
        remarks: 'Ticker change processed for all client holdings. Verified new ticker META is reflected in accounts.'
    },
    {
        ...mockStockActions.find(a => a.id === '6')!, // Amazon Stock Split
        processor: 'Admin B',
        processedDate: '2024-03-21',
        remarks: 'Stock split completed. All client accounts updated with the new share count.'
    }
];
