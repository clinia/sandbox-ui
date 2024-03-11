import { Hits } from '@/components/hits';
import { SearchProvider } from '@/components/search-provider';
import { Searchbox } from '@/components/searchbox';
import { SearchRequest } from '@/lib/client';
import { getInfoPocServerClient } from '@/lib/info-poc-client';
import { SearchParameters } from '@clinia/search-sdk-core';

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

  const client = getInfoPocServerClient();

  const resp = await client.search(req);

  return (
    <SearchProvider
      state={{
        searchRequest: req,
        searchResponse: resp,
      }}
    >
      <div className="grid justify-center">
        <Searchbox className="w-[570px]" />
        <Hits />
      </div>
    </SearchProvider>
  );
}
