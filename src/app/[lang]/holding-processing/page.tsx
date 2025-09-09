
import HoldingProcessor from '@/components/holding-processor';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';

export default async function HoldingProcessingPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  return (
    <HoldingProcessor
      dictionary={dict.stockTracker}
      actionTypeDictionary={dict.actionTypes}
      holdingDictionary={dict.holdingProcessor}
    />
  );
}
