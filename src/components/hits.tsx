'use client';

import { Article, Hit } from '@/lib/client';
import { useHits } from '@clinia/search-sdk-react';

export const Hits = () => {
  const hits = useHits() as Hit<Article>[];

  return (
    <div>
      {hits.map((hit) => (
        <div key={hit.resource.id}>
          <h2>{hit.resource.title}</h2>
        </div>
      ))}
    </div>
  );
};
