'use client';

import { Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@clinia-ui/react';

export const Searchbox = () => {
  const t = useTranslations();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

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

  return (
    <Command className="border" loop>
      <CommandInput
        placeholder={t('searchbox.placeholder')}
        value={value}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onValueChange={(v) => setValue(v)}
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
                    onSelect={(v) => console.log(v)}
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
