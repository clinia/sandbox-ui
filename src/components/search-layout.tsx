'use client';

import { Article, Hit } from '@/lib/client';
import { createContext, useContext, useState } from 'react';

type SearchLayoutContextState = {
  hit: Hit<Article> | undefined;
  setHit: (s?: Hit<Article>) => void;
};
const SearchLayoutContext = createContext<SearchLayoutContextState>({
  get hit(): Hit<Article> | undefined {
    throw new Error('Not implemented');
  },
  setHit: () => {
    throw new Error('Not implemented');
  },
});

export const useSearchLayout = () => {
  return useContext(SearchLayoutContext);
};

const SearchLayout = ({ children }: { children: React.ReactNode }) => {
  const [hit, setHit] = useState<Hit<Article> | undefined>();

  const hasDrawer = Boolean(hit);

  return (
    <SearchLayoutContext.Provider value={{ hit, setHit }}>
      <div className="group flex flex-grow" {...{ 'data-drawer': hasDrawer }}>
        {children}
      </div>
    </SearchLayoutContext.Provider>
  );
};

const SearchLayoutDrawer = ({ children }: { children: React.ReactNode }) => {
  return (
    <aside className="h-screen flex-shrink -translate-x-full bg-background transition-transform duration-300 ease-in-out group-data-[drawer=false]:w-0 group-data-[drawer=true]:w-[500px] group-data-[drawer=true]:border-l sm:translate-x-0">
      {children}
    </aside>
  );
};

export { SearchLayout, SearchLayoutDrawer };
