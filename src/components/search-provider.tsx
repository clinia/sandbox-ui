'use client';

import { SearchRequest, SearchResponse } from '@/lib/client';
import { client } from '@/lib/info-poc-client';
import { PropsWithChildren, use, useCallback, useEffect, useMemo } from 'react';
import {
  SearchParameters,
  type SearchSDKOptions,
} from '@clinia/search-sdk-core';
import { SearchSDKProvider, useCollection } from '@clinia/search-sdk-react';
import { Collection } from '@clinia/search-sdk-react';

type SearchProviderProps = PropsWithChildren<{
  state?: {
    searchRequest: SearchRequest;
    searchResponse: SearchResponse;
  };
}>;

export const SearchProvider = ({ children, state }: SearchProviderProps) => {
  const search: SearchSDKOptions['search'] = async (_collection, params) => {
    const r = await fetch(`/api/assistant`, {
      method: 'POST',
      body: JSON.stringify({
        query: params.query,
        articles: [
          '{"id": "test-id-1", "text": "", "title": "Process of finding bone problems", "passages": ["Bone defects can be found by means of a bone scanner"]}',
          '{"id": "test-id-2", "text": "", "title": "Process of finding mind problems", "passages": ["Mind problems are the field of a psychologist"]}',
        ],
      }),
    });
    const resp = await r.json();
    // const resp = await client.search({ query: params.query ?? '' });
    return {
      hits: resp.hits,
      meta: {
        numPages: 1,
        page: 1,
        perPage: 10,
        total: resp.hits.length,
        ...resp.meta,
      },
    };
  };

  const searchForFacets: SearchSDKOptions['searchForFacets'] =
    useCallback(async () => {
      return Promise.resolve({
        data: [],
        meta: {
          numPages: 0,
          page: 0,
          perPage: 0,
          total: 0,
        },
      });
    }, []);

  const initialState = useMemo((): SearchSDKOptions['initialState'] => {
    if (!state) {
      return undefined;
    }

    const params = new SearchParameters();
    params.query = state.searchRequest.query;

    return {
      isLoading: false,
      params,
      result: {
        hits: state.searchResponse.hits,
        meta: {
          numPages: 1,
          page: 1,
          perPage: 10,
          total: state.searchResponse.hits.length,
          ...state.searchResponse.meta,
        },
      },
    };
  }, [state]);

  return (
    <SearchSDKProvider
      options={{
        search,
        searchForFacets,
        initialState,
      }}
    >
      <Collection partition="main" collection="articles">
        {children}
      </Collection>
    </SearchSDKProvider>
  );
};
