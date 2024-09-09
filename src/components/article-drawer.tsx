'use client';

import { HitsHighlight } from '@/lib/client';
import { getHighlightText } from '@/lib/client/util';
import { X } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@clinia-ui/react';
import { HtmlDisplay } from './html-display';
import { useSearchLayout } from './search-layout';

export const ArticleDrawer = () => {
  const searchLayout = useSearchLayout();

  const hitsToDisplay = useMemo((): string[] => {
    const allhighlights = Object.values(
      searchLayout.hit?.highlighting ?? {}
    ).flat();
    if (allhighlights.length === 0) {
      return [];
    }

    const hitsHighlights = allhighlights.filter(
      (highlight): highlight is HitsHighlight =>
        'type' in highlight && highlight.type === 'vector'
    );
    if (hitsHighlights.length === 0) {
      return allhighlights.map(getHighlightText);
    }

    // We display the hits by score
    return hitsHighlights
      .sort((a, b) => b.score - a.score)
      .map(getHighlightText);
  }, [searchLayout.hit?.highlighting]);

  if (!searchLayout.hit) {
    return null;
  }

  return (
    <div className="relative">
      <header className="absolute left-0 z-40 h-[48px] w-full border-b bg-background px-4 py-2">
        <div className=" flex flex-nowrap items-center justify-between gap-1 align-middle">
          <span className="text-sm font-medium text-gray-700">
            Excerpt from Article
          </span>
          <Button
            variant="link"
            size="icon"
            onClick={() => searchLayout.setHit()}
          >
            <X size={18} className="stroke-foreground" />
          </Button>
        </div>
      </header>
      <div className="absolute left-0 h-[calc(100vh-48px)] w-full overflow-y-auto pt-[48px]">
        <div className="px-4 py-6">
          <h1 className="mb-4 text-xl font-medium text-foreground">
            {searchLayout.hit.resource.data.title}
          </h1>

          {hitsToDisplay.map((highlight, idx) => (
            <HtmlDisplay
              className="my-4 whitespace-pre-line text-sm [&_em]:font-bold"
              key={idx}
              html={highlight}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
