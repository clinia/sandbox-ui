import { Hits } from '@/components/hits';
import { QuestionsResult } from '@/components/questions';
import { SearchProvider } from '@/components/search-provider';
import { Searchbox } from '@/components/searchbox';
import { SearchRequest } from '@/lib/client';

const parseSearchRequest = (searchParams: {
  [key: string]: string | string[] | undefined;
}): SearchRequest => {
  const req: SearchRequest = {
    query: '',
  };

  if (typeof searchParams.q === 'string') {
    req.query = searchParams.q;
  }

  return req;
};

export default async function Search({
  searchParams,
}: {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const req = parseSearchRequest(searchParams);

  return (
    <SearchProvider>
      <div className="grid justify-center gap-8">
        <Searchbox className="w-[570px]" initialQuery={req.query} />
        <QuestionsResult />
        <Hits />
      </div>
    </SearchProvider>
  );
}
