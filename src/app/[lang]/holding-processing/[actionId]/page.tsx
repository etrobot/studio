
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { mockStockActions } from '@/lib/mock-data';
import HoldingDetails from '@/components/holding-details';
import { notFound } from 'next/navigation';

export default async function HoldingDetailsPage({
  params: { lang, actionId },
}: {
  params: { lang: Locale, actionId: string };
}) {
  const dict = await getDictionary(lang);
  const action = mockStockActions.find((a) => a.id === actionId);

  if (!action) {
    notFound();
  }

  return (
      <HoldingDetails 
        action={action}
        dictionary={dict.holdingProcessor}
        lang={lang}
      />
  );
}
