'use client';

import { Article, Hit } from '@/lib/client';
import { useMemo } from 'react';
import { getHighlightText, isVectorHighlight } from '../lib/client/util';
import { HtmlDisplay } from './html-display';
import { useSearchLayout } from './search-layout';

export const ArticleHit = ({ hit }: { hit: Hit<Article> }) => {
  // TODO: should take the highlighing from 'abstract.passages.vector' | 'content.text.passages.vector'
  // We will take all the highlights from all the keys `abstract.passages.vector`, `content.text.passages.vector`, etc.
  // Then we will display only the hit with the highest score as the single paragraph below.
  const highestHitsHighlight = useMemo(() => {
    const allHighlights = Object.values(hit.highlighting ?? {}).flat();
    if (allHighlights.length === 0) {
      return undefined;
    }
    const hitsHighlights = allHighlights.filter(isVectorHighlight);
    if (hitsHighlights.length === 0) {
      // We fallback to displaying the first text highlight
      return getHighlightText(allHighlights[0]);
    }

    return getHighlightText(
      hitsHighlights
        // We sort the hits by score and take the highest one
        .sort((a, b) => b.score - a.score)[0]
    );
  }, [hit]);
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
      {highestHitsHighlight && (
        <HtmlDisplay
          className="text-sm text-muted-foreground"
          html={highestHitsHighlight}
        />
      )}
      {/* {passageHighlight && <PassageHighlight highlight={passageHighlight} />} */}
    </article>
  );
};
