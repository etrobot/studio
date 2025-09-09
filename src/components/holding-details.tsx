
"use client"

import Link from 'next/link';
import { ArrowLeft, User, Calendar, FileText } from 'lucide-react';
import type { Locale } from '@/i18n-config';
import type { StockAction } from '@/types';
import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HoldingConfirmationDialog } from './holding-confirmation-dialog';
import { Badge } from '@/components/ui/badge';

// Mock data for client holdings - in a real app, this would be fetched based on actionId
const mockClientHoldings = [
    { id: 'client1', chineseName: '张三', englishName: 'Zhang San', accountNumber: '12345678', quantity: 1000 },
    { id: 'client2', chineseName: '李四', englishName: 'Li Si', accountNumber: '87654321', quantity: 500 },
    { id: 'client3', chineseName: '王五', englishName: 'Wang Wu', accountNumber: '11223344', quantity: 2500 },
];

interface ProcessingDetails {
    processor: string;
    processedDate: string;
    remarks: string;
}

interface HoldingDetailsProps {
    action: StockAction;
    dictionary: Dictionary['holdingProcessor'];
    lang: Locale;
    isCompleted: boolean;
    processingDetails?: ProcessingDetails;
}

export default function HoldingDetails({ action, dictionary, lang, isCompleted, processingDetails }: HoldingDetailsProps) {

  return (
    <div className="space-y-6">
      <Button asChild variant="outline">
        <Link href={`/${lang}/holding-processing`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {dictionary.backToListButton}
        </Link>
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{dictionary.holdingDetailsFor} {action.companyName} ({action.ticker})</CardTitle>
              <CardDescription>{action.actionDetails}</CardDescription>
            </div>
            {isCompleted ? (
              <Badge variant="secondary">{dictionary.completedTab}</Badge>
            ) : (
              <Badge>{dictionary.pendingTab}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>{dictionary.detailsTable.chineseName}</TableHead>
                    <TableHead>{dictionary.detailsTable.englishName}</TableHead>
                    <TableHead>{dictionary.detailsTable.accountNumber}</TableHead>
                    <TableHead className="text-right">{dictionary.detailsTable.quantity}</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {mockClientHoldings.map((holding) => (
                    <TableRow key={holding.id}>
                    <TableCell>{holding.chineseName}</TableCell>
                    <TableCell>{holding.englishName}</TableCell>
                    <TableCell>{holding.accountNumber}</TableCell>
                    <TableCell className="text-right">{holding.quantity.toLocaleString()}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
           </div>
        </CardContent>
      </Card>
      
      {isCompleted && processingDetails && (
        <Card>
            <CardHeader>
                <CardTitle>{dictionary.processingDetailsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold mr-2">{dictionary.tableHeaderProcessor}:</span>
                    <span>{processingDetails.processor}</span>
                </div>
                <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold mr-2">{dictionary.tableHeaderProcessedDate}:</span>
                    <span>{processingDetails.processedDate}</span>
                </div>
                <div className="flex items-start">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-col">
                        <span className="font-semibold">{dictionary.dialog.remarksLabel}:</span>
                        <p className="text-muted-foreground mt-1">{processingDetails.remarks}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-4">
        {!isCompleted && <HoldingConfirmationDialog dictionary={dictionary} />}
      </div>
    </div>
  );
}
