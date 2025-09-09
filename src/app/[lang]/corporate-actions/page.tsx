
import StockActionTracker from '@/components/stock-action-tracker';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';

export default async function CorporateActionsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  return (
      <StockActionTracker dictionary={dict.stockTracker} actionTypeDictionary={dict.actionTypes} />
  );
}
