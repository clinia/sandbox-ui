import { fontSans } from '@/config/fonts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import I18nProvider from './i18n-provider';
import { Sidebar } from './sidebar';

function cn(...inputs: string[]) {
  const cls = clsx(inputs);
  return twMerge(cls);
}

export const metadata: Metadata = {
  title: 'Clinia Sandbox',
};

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <I18nProvider locale={locale}>
          <Sidebar />
          <main className="min-h-screen p-4 sm:ml-56">{children}</main>
        </I18nProvider>
      </body>
    </html>
  );
}
