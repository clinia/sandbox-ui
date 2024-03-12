'use client';

import { X } from 'lucide-react';
import Markdown from 'react-markdown';
import { Button } from '@clinia-ui/react';
import { useSearchLayout } from './search-layout';

export const ArticleDrawer = () => {
  const searchLayout = useSearchLayout();

  if (!searchLayout.hit) {
    return null;
  }

  return (
    <div className="relative">
      <header className="absolute left-0 z-40 h-[48px] w-full border-b bg-background px-4 py-2">
        <div className=" flex flex-nowrap justify-between gap-1 align-middle">
          <span className="text-sm font-medium text-gray-700"></span>
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
            {searchLayout.hit.resource.title}
          </h1>
          {searchLayout.hit.highlight.map((highlight, idx) => (
            <Markdown
              components={{
                h1: (props) => (
                  <h1
                    className="mb-3 text-xl font-medium text-foreground"
                    {...props}
                  />
                ),
                h2: (props) => (
                  <h2 className="mb-2 text-lg font-medium" {...props} />
                ),
                h3: (props) => (
                  <h3 className="mb-1 text-base font-medium" {...props} />
                ),
              }}
              key={idx}
            >
              {highlight.match}
            </Markdown>
          ))}
        </div>
      </div>
    </div>
  );
};
