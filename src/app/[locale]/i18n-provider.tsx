import { getMessages } from '@/i18n';
import type { PropsWithChildren } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import type { useTimeZone } from 'next-intl';

export type I18nProviderProps = PropsWithChildren<{
  locale: string;
  timeZone?: ReturnType<typeof useTimeZone>;
}>;

export default async function I18nProvider({
  children,
  locale,
  timeZone,
}: I18nProviderProps) {
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider
      formats={{
        dateTime: {
          long: {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          },
        },
      }}
      locale={locale}
      messages={messages}
      now={new Date()}
      timeZone={timeZone}
    >
      {children}
    </NextIntlClientProvider>
  );
}
