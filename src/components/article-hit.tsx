'use client';

import { Article, Hit } from '@/lib/client';
import { PassageHighlight } from './highlight';
import { useSearchLayout } from './search-layout';

export const ArticleHit = ({ hit }: { hit: Hit<Article> }) => {
  const abstractPassages = hit.highlighting?.['abstract.passages'].slice(0, 1);
  console.log(abstractPassages);
  const searchLayout = useSearchLayout();

  return (
    <article
      className="cursor-pointer py-4 "
      onClick={() => {
        searchLayout.setHit(hit);
      }}
    >
      <h1 className="mb-2 text-lg font-medium text-foreground">
        {hit.resource.data.title}
      </h1>
      <p className="text-sm text-muted-foreground">
        {abstractPassages?.[0].highlight}
      </p>
      {/* {passageHighlight && <PassageHighlight highlight={passageHighlight} />} */}
    </article>
  );
};
