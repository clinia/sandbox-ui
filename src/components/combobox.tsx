'use client';

import { useClickAway } from '@uidotdev/usehooks';
import { Search, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@clinia-ui/react';

type ComboBoxProps = React.HTMLAttributes<HTMLDivElement> & {
  initialQuery?: string;
};

export const ComboBox = ({
  className,
  initialQuery,
  ...props
}: ComboBoxProps) => {
  const t = useTranslations();
  const [value, setValue] = useState(initialQuery ?? '');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // const groups = useMemo(
  //   () => [
  //     {
  //       heading: t('searchbox.groups.ask.heading'),
  //       icon: <Sparkles size={14} className="stroke-primary" />,
  //       items: [
  //         'How long to prepare for ACLR?',
  //         'Recovery time for ACLR',
  //         'How to treat a torn meniscus?',
  //       ],
  //     },
  //     {
  //       heading: t('searchbox.groups.search.heading'),
  //       icon: <Search size={14} />,
  //       items: ['ACL recovery'],
  //     },
  //   ],
  //   [t]
  // );

  const ref = useClickAway<HTMLDivElement>(() => setOpen(false));

  const handleSearch = (v: string) => {
    // Else we push the new search query to the router
    router.push(`/search?q=${v}`);
  };

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

      {/* <CommandList>
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
      </CommandList> */}
    </Command>
  );
};
