'use client';

import { Article, Hit } from '@/lib/client';
import { useHits, useLoading } from '@clinia/search-sdk-react';
import { ArticleHit } from './article-hit';

export const Hits = () => {
  const hits = useHits() as Hit<Article>[];
  const loading = useLoading();

  if (hits.length === 0 || loading) {
    return null;
  }

  return (
    <div className="grid w-[674px] grid-cols-1 divide-y rounded-lg border px-4">
      {hits.map((hit) => (
        <ArticleHit hit={hit} key={hit.resource.id} />
      ))}
    </div>
  );
};
