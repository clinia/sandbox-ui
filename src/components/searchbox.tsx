'use client';

import { LoaderCircle, Search } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLoading, useQuery } from '@clinia/search-sdk-react';
import { Input } from '@clinia-ui/react';

type SearchBoxProps = {
  className?: string;
};
export const SearchBox = ({ className }: SearchBoxProps) => {
  const t = useTranslations();
  const [query, setQuery] = useQuery();
  const loading = useLoading();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (v: string) => {
    const searchParams = new URLSearchParams(params?.toString());
    searchParams.set('q', v);
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  const q = params?.get('q') ?? '';
  const [value, setValue] = useState(q);

  useEffect(() => {
    setValue(q);
    setQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when q changes
  }, [q]);

  return (
    <div className={twMerge('relative w-full', className)}>
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
        <Search size={16} className="stroke-primary" />
      </div>
      <Input
        className="pe-10 ps-10"
        prefix="search"
        value={value}
        placeholder={t('searchbox.placeholder')}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSearch(e.currentTarget.value);
          }
        }}
      />
      {loading && (
        <button
          type="button"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          <LoaderCircle className="animate-spin" />
        </button>
      )}
    </div>
  );
};
