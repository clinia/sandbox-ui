'use client';

import { useClickAway } from '@uidotdev/usehooks';
import { Search, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@clinia/search-sdk-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@clinia-ui/react';

type SearchBoxProps = React.HTMLAttributes<HTMLDivElement> & {
  initialQuery?: string;
};

export const Searchbox = ({
  className,
  initialQuery,
  ...props
}: SearchBoxProps) => {
  const [query, setQuery] = useQuery();
  const t = useTranslations();
  const [value, setValue] = useState(initialQuery ?? '');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const groups = useMemo(
    () => [
      {
        heading: t('searchbox.groups.ask.heading'),
        icon: <Sparkles size={14} className="stroke-primary" />,
        items: [
          'How long to prepare for ACLR?',
          'Recovery time for ACLR',
          'How to treat a torn meniscus?',
        ],
      },
      {
        heading: t('searchbox.groups.search.heading'),
        icon: <Search size={14} />,
        items: ['ACL recovery'],
      },
    ],
    [t]
  );

  const ref = useClickAway<HTMLDivElement>(() => setOpen(false));

  const handleSearch = (v: string) => {
    if (pathname === '/search') {
      setQuery(v);
      setValue(v);
      return;
    }

    // Else we push the new search query to the router
    router.push(`/search?q=${v}`);
  };

  useEffect(() => {
    if (pathname === '/search') {
      setQuery(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We only want to run this once
  }, []);

  return (
    <Command className={twMerge('border', className)} loop ref={ref} {...props}>
      <CommandInput
        placeholder={t('searchbox.placeholder')}
        value={value}
        onFocus={() => setOpen(true)}
        onValueChange={(v) => setValue(v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch(value);
          }
        }}
      />

      <CommandList>
        {open && (
          <>
            <CommandEmpty>No results found.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup
                key={group.heading}
                heading={
                  <span className="text-base text-foreground">
                    {group.heading}
                  </span>
                }
              >
                {group.items.map((item) => (
                  <CommandItem
                    key={item}
                    className="gap-2"
                    onSelect={(v) => handleSearch(v)}
                  >
                    {group.icon}
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </>
        )}
      </CommandList>
    </Command>
  );
};
