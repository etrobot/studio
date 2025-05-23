import 'server-only';
import type { Locale } from '@/i18n-config';

// We enumerate all dictionaries here for better linting and typescript support
const dictionaries = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  zh: () => import('@/locales/zh.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return locale === 'zh' ? dictionaries.zh() : dictionaries.en();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
