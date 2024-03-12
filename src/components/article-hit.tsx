'use client';

import { Article, Hit } from '@/lib/client';
import { PassageHighlight } from './highlight';
import { useSearchLayout } from './search-layout';

export const ArticleHit = ({ hit }: { hit: Hit<Article> }) => {
  const passageHighlight = hit.highlight.find((h) => h.type === 'passage');
  const searchLayout = useSearchLayout();

  return (
    <article
      className="cursor-pointer py-4 "
      onClick={() => {
        searchLayout.setHit(hit);
      }}
    >
      <h1 className="mb-2 text-lg font-medium text-foreground">
        {hit.resource.title}
      </h1>
      {passageHighlight && <PassageHighlight highlight={passageHighlight} />}
    </article>
  );
};
