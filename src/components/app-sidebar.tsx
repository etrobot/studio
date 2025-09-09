
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BookCopy } from 'lucide-react';

import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import LanguageSwitcher from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { InstructionsDialog } from './instructions-dialog';

interface AppSidebarProps {
  lang: Locale;
  dictionary: Dictionary;
}

export function AppSidebar({ lang, dictionary }: AppSidebarProps) {
  const pathname = usePathname();

  const getPath = (path: string) => `/${lang}${path}`;

  const menuItems = [
    {
      href: getPath('/holding-processing'),
      label: dictionary.sidebar.holdingProcessing,
      icon: <Users />,
    },
    {
      href: getPath('/corporate-actions'),
      label: dictionary.sidebar.corporateActions,
      icon: <BookCopy />,
    },
  ];

  return (
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-xl font-semibold pl-2">{dictionary.appTitleShort}</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex-row items-center justify-end gap-2">
          <InstructionsDialog dictionary={dictionary.instructionsDialog} />
          <LanguageSwitcher currentLang={lang} dictionary={dictionary.languageSwitcher} />
          <ThemeToggle dictionary={dictionary.themeToggle} />
        </SidebarFooter>
      </Sidebar>
  );
}
