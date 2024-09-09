'use client';

import { SearchRequest, SearchResponse } from '@/lib/client';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import { Host } from '@clinia/client-common';
import client from '@clinia/client-datapartition';
import {
  SearchParameters,
  type SearchSDKOptions,
} from '@clinia/search-sdk-core';
import { Collection, SearchSDKProvider } from '@clinia/search-sdk-react';

type SearchProviderProps = PropsWithChildren<{
  state?: {
    searchRequest: SearchRequest;
    searchResponse: SearchResponse;
  };
}>;

const getHost = (): Host => {
  const url = new URL(window.location.origin);
  if (url.host.endsWith('/')) {
    url.host = url.host.slice(0, -1);
  }

  return {
    protocol: url.protocol.replace(':', '') as 'http' | 'https',
    url: `${url.host}/api`,
    accept: 'readWrite',
  };
};

const datapartitionClient = client(
  'clinia',
  {
    mode: 'BearerToken',
    bearerToken: '',
  },
  {
    hosts: [getHost()],
  }
);

export const SearchProvider = ({ children, state }: SearchProviderProps) => {
  const search: SearchSDKOptions['search'] = async (_collection, params) => {
    const resp = await datapartitionClient.searchClient.query<
      Record<string, any>
    >({
      partitionKey: 'clinia',
      collectionKey: 'articles',
      v1SearchParameters: {
        page: 0,
        perPage: 5,
        query: {
          or: [
            {
              match: {
                'abstract.passages': {
                  value: params.query ?? '',
                  type: 'word',
                },
              },
            },
            {
              knn: {
                'abstract.passages.vector': {
                  value: params.query ?? '',
                },
              },
            },
          ],
        },
        highlighting: ['abstract.passages'],
      },
    });
    // const resp = await client.search({ query: params.query ?? '' });
    return resp;
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
