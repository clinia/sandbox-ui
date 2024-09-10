'use client';

import { useHits, useLoading, useQuery } from '@clinia/search-sdk-react';
import { cn } from '@clinia-ui/react';
import { NotFoundIcon } from './not-found-icon';

type NotFoundProps = {
  className?: string;
};
const maxLength = 200;
export const NotFound = ({ className }: NotFoundProps) => {
  const [query] = useQuery();
  const hits = useHits();
  const loading = useLoading();

  if (hits?.length > 0 || loading) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex max-w-[790px] flex-col items-center gap-2 text-center',
        className
      )}
    >
      <NotFoundIcon />
      <h2 className="text-xl font-medium text-foreground">
        No results found for &apos;
        <span title={query}>
          {query.slice(0, maxLength)}
          {query.length > maxLength ? '...' : ''}
        </span>
        &apos;
      </h2>
      <p>
        There aren&apos;t any results matching your query. This can happen when
        you search for something overly specific, or something outside the scope
        of your dataset.
      </p>
    </div>
  );
};
