"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';
import type { Dictionary } from '@/lib/dictionaries';

interface LanguageSwitcherProps {
  currentLang: Locale;
  dictionary: Dictionary['languageSwitcher'];
}

export default function LanguageSwitcher({ currentLang, dictionary }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale: Locale) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{dictionary.changeLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => changeLocale(locale)}
            disabled={currentLang === locale}
          >
            {locale === 'en' ? dictionary.english : dictionary.chinese}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
