
import type { Metadata, ResolvingMetadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

type Props = {
  params: { lang: Locale };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return {
    title: dict.layout.title,
    description: dict.layout.description,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);
  return (
    <html lang={params.lang} className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="app-theme"
        >
          <SidebarProvider>
            <AppSidebar
              lang={params.lang}
              dictionary={dict}
            />
            <main className="flex-grow">
              <header className="flex items-center p-4 border-b md:hidden">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold ml-4">{dict.appTitleShort}</h1>
              </header>
              <div className="p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </main>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
