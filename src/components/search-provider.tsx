'use client';

import { SearchRequest, SearchResponse } from '@/lib/client';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Host } from '@clinia/client-common';
import datapartitionclient from '@clinia/client-datapartition';
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

type DatapartitionClient = ReturnType<typeof datapartitionclient>;
let datapartitionClient: DatapartitionClient;
const getClient = (): DatapartitionClient => {
  if (!datapartitionClient) {
    datapartitionClient = datapartitionclient(
      'clinia',
      {
        mode: 'BearerToken',
        bearerToken: '',
      },
      {
        hosts: [getHost()],
      }
    );
  }

  return datapartitionClient;
};

export const SearchProvider = ({ children, state }: SearchProviderProps) => {
  const client = useRef(
    // Dumb value, we're just setting this to avoid having undefined in the ref.
    datapartitionclient('clinia', { mode: 'BearerToken', bearerToken: '' })
  );
  useEffect(() => {
    // We set the client in a ref to avoid hydration errors (window not defined).
    client.current = getClient();
  }, []);

  const search: SearchSDKOptions['search'] = async (_collection, params) => {
    return client.current.searchClient.query<Record<string, any>>({
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
                  type: 'phrase',
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
            {
              match: {
                title: {
                  value: params.query ?? '',
                  type: 'word',
                },
              },
            },
            {
              match: {
                keywords: {
                  value: params.query ?? '',
                  type: 'word',
                },
              },
            },
            {
              knn: {
                'content.text.passages.vector': {
                  value: params.query ?? '',
                },
              },
            },
          ],
        },
        highlighting: [
          'abstract.passages',
          'abstract.passages.vector',
          'title',
          'keywords',
          'content.text.passages.vector',
        ],
      },
    });
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
