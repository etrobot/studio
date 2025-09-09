
import type { StockAction } from '@/types';

export const mockStockActions: StockAction[] = [
  {
    id: '1',
    announcementDate: '2024-07-01',
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    actionType: 'Dividend',
    actionDetails: 'Quarterly cash dividend of $0.25 per share.',
    valueBefore: '',
    valueAfter: '$0.25/share',
    effectiveDate: '2024-07-15',
  },
  {
    id: '2',
    announcementDate: '2024-06-15',
    ticker: 'MSFT',
    companyName: 'Microsoft Corp.',
    actionType: 'Dividend',
    actionDetails: 'Quarterly cash dividend of $0.68 per share.',
    valueBefore: '',
    valueAfter: '$0.68/share',
    effectiveDate: '2024-07-01',
  },
  {
    id: '3',
    announcementDate: '2024-05-20',
    ticker: 'GOOGL',
    companyName: 'Alphabet Inc.',
    actionType: 'Stock Split',
    actionDetails: '20-for-1 stock split.',
    valueBefore: '1 share',
    valueAfter: '20 shares',
    effectiveDate: '2024-06-10',
  },
  {
    id: '4',
    announcementDate: '2024-07-05',
    ticker: 'TSLA',
    companyName: 'Tesla, Inc.',
    actionType: 'Other',
    actionDetails: 'Shareholder meeting to vote on CEO compensation package.',
    valueBefore: '',
    valueAfter: '',
    effectiveDate: '2024-08-01',
  },
  {
    id: '5',
    announcementDate: '2024-04-10',
    ticker: 'FB',
    companyName: 'Meta Platforms, Inc.',
    actionType: 'Ticker Change',
    actionDetails: 'Company changed ticker from FB to META.',
    valueBefore: 'FB',
    valueAfter: 'META',
    effectiveDate: '2024-05-01',
  },
  {
    id: '6',
    announcementDate: '2024-03-01',
    ticker: 'AMZN',
    companyName: 'Amazon.com, Inc.',
    actionType: 'Stock Split',
    actionDetails: '3-for-1 stock split.',
    valueBefore: '1 share',
    valueAfter: '3 shares',
    effectiveDate: '2024-03-20',
  },
  {
    id: '7',
    announcementDate: '2024-07-10',
    ticker: 'NVDA',
    companyName: 'NVIDIA Corporation',
    actionType: 'Dividend',
    actionDetails: 'Quarterly cash dividend of $0.04 per share (post-split).',
    valueBefore: '',
    valueAfter: '$0.04/share',
    effectiveDate: '2024-07-25',
  },
  {
    id: '8',
    announcementDate: '2024-02-15',
    ticker: 'OLDCO',
    companyName: 'Old Company Inc.',
    actionType: 'Merger',
    actionDetails: 'Acquired by NEWCO Inc.',
    valueBefore: 'OLDCO shares',
    valueAfter: 'Cash or NEWCO shares',
    effectiveDate: '2024-03-30',
  },
  {
    id: '9',
    announcementDate: '2024-07-18',
    ticker: 'BRK.A',
    companyName: 'Berkshire Hathaway Inc.',
    actionType: 'Other',
    actionDetails: 'Annual shareholder meeting highlights.',
    valueBefore: '',
    valueAfter: '',
    effectiveDate: '2024-07-18',
  },
  {
    id: '10',
    announcementDate: '2024-01-05',
    ticker: 'SPCE',
    companyName: 'Virgin Galactic Holdings',
    actionType: 'Other',
    actionDetails: 'Reverse stock split 1-for-20.',
    valueBefore: '20 shares',
    valueAfter: '1 share',
    effectiveDate: '2024-01-20',
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
