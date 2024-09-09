'use client';

import { Article, Hit } from '@/lib/client';
import { PassageHighlight } from './highlight';
import { useSearchLayout } from './search-layout';

export const ArticleHit = ({ hit }: { hit: Hit<Article> }) => {
  // TODO: should take the highlighing from 'abstract.passages.vector' | 'content.text.passages.vector'
  // We will take all the highlights from all the keys `abstract.passages.vector`, `content.text.passages.vector`, etc.
  // Then we will display only the hit with the highest score as the single paragraph below.
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
        {/* TODO: sanitize html and render it as rich */}
        {abstractPassages?.[0].highlight}
      </p>
      {/* {passageHighlight && <PassageHighlight highlight={passageHighlight} />} */}
    </article>
  );
};
