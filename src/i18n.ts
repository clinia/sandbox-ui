import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'de'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

const messages = {
  en: (): Record<string, any> =>
    import('../messages/en.json').then((module) => module.default),
  fr: (): Record<string, any> =>
    import('../messages/fr.json').then((module) => module.default),
};

type Locales = keyof typeof messages;

export const getMessages = async (locale: string) => {
  const key = locale as Locales;
  return messages[key]();
};
