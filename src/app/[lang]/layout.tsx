import type { Metadata, ResolvingMetadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '../globals.css'; // Adjusted path
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import LanguageSwitcher from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n-config';
import { i18n } from '@/i18n-config';

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
          <div className="min-h-screen flex flex-col">
            <header className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold sm:text-2xl">{dict.appTitleShort}</h1>
                <div className="flex items-center space-x-2">
                  <LanguageSwitcher currentLang={params.lang} dictionary={dict.languageSwitcher} />
                  <ThemeToggle dictionary={dict.themeToggle} />
                </div>
              </div>
            </header>
            <main className="flex-grow container mx-auto py-4 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
