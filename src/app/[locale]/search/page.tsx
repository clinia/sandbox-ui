import { Assistant } from '@/components/assistant';
import { Hits } from '@/components/hits';
import { NotFound } from '@/components/not-found';
import { SearchProvider } from '@/components/search-provider';
import { SearchBox } from '@/components/searchbox';

export default async function Search() {
  return (
    <SearchProvider>
      <div className="min-w-96 flex-grow">
        <div className="relative">
          {/* <header className="absolute left-0 z-40 h-[48px] w-full border-b bg-background">
          </header> */}
          <div className="absolute left-0 h-screen w-full overflow-y-auto pt-[48px]">
            <div className="flex flex-col items-center justify-center gap-8 py-8">
              <SearchBox className="w-[570px]" />
              <Assistant className="w-[674px]" />
              {/* <QuestionsResult /> */}
              <Hits />
              <NotFound className="mt-8" />
            </div>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
