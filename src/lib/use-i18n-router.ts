import { useParams, useRouter } from 'next/navigation';

export const useI18nRouter = (): ReturnType<typeof useRouter> => {
  const { locale } = useParams();
  const router = useRouter();

  return {
    push: (url: string) => router.push(`/${locale}${url}`),
    forward: () => router.forward(),
    back: () => router.back(),
    replace: (url: string) => router.replace(`/${locale}${url}`),
    refresh: () => router.refresh(),
    prefetch: (url: string) => router.prefetch(`/${locale}${url}`),
  };
};
