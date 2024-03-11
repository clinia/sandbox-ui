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
    const resp = await client.search({ query: params.query ?? '' });
    return {
      hits: resp.hits,
      meta: {
        numPages: 1,
        page: 1,
        perPage: 10,
        total: resp.hits.length,
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
