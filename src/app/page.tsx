
// src/app/page.tsx (acts as a redirector to default locale)
import { redirect } from 'next/navigation';
import { i18n } from '../i18n-config';

export default function RootPage() {
  redirect(`/${i18n.defaultLocale}/holding-processing`);
}
