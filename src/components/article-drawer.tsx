'use client';

import { X } from 'lucide-react';
import Markdown from 'react-markdown';
import Link from 'next/link';
import { Button } from '@clinia-ui/react';
import { PassageHighlight } from './highlight';
import { useSearchLayout } from './search-layout';

export const ArticleDrawer = () => {
  const searchLayout = useSearchLayout();

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
          {/* TODO: Loop over hit.hihglingting of type hits and render them
            We will sanitize the html and render it as html
          */}
          <h1 className="mb-4 text-xl font-medium text-foreground">
            {searchLayout.hit.resource.data.title}
          </h1>
          {/* TODO: remove me */}
          <h2 className="text-lg">Abstract</h2>
          <p className="text-sm">{searchLayout.hit.resource.data.abstract}</p>

          {/* TODO: remove me */}
          {searchLayout.hit.resource.data.content.map((content) => (
            <div key={content.title}>
              <h2 className="text-lg">{content.title}</h2>
              <p className="text-sm">{content.text}</p>
            </div>
          ))}

          {/* {searchLayout.hit.highlight.map((highlight, idx) => (
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
            // <PassageHighlight key={idx} highlight={highlight} />
          ))} */}
        </div>
      </div>
    </div>
  );
};
