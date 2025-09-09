
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { mockStockActions, mockCompletedActions } from '@/lib/mock-data';
import HoldingDetails from '@/components/holding-details';
import { notFound } from 'next/navigation';

export default async function HoldingDetailsPage({
  params: { lang, actionId },
}: {
  params: { lang: Locale, actionId: string };
}) {
  const dict = await getDictionary(lang);
  
  const completedAction = mockCompletedActions.find((a) => a.id === actionId);
  const pendingAction = mockStockActions.find((a) => a.id === actionId);

  const action = completedAction || pendingAction;

  if (!action) {
    notFound();
  }

  const isCompleted = !!completedAction;
  const processingDetails = isCompleted ? {
    processor: completedAction.processor,
    processedDate: completedAction.processedDate,
    remarks: completedAction.remarks,
  } : undefined;

  return (
      <HoldingDetails 
        action={action}
        dictionary={dict.holdingProcessor}
        lang={lang}
        isCompleted={isCompleted}
        processingDetails={processingDetails}
      />
  );
}
