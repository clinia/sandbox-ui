import { SearchResponse } from '@/lib/client';
import { useObserver } from '@clinia/search-sdk-react';

export const useMeta = () => {
  const meta = useObserver({
    key: 'meta',
    onSearchStateChange: (state) => {
      if (!state.result)
        return {
          queryId: '',
          queryIntent: '',
          query: '',
          questions: [],
        };

      return state.result.meta as unknown as SearchResponse['meta'];
    },
  });

  return meta;
};
