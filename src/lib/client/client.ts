import { InformationPocClient } from './types';

export type CreateClientOptions = {
  baseUrl: string;
};

export function informationPocClient(
  opts: CreateClientOptions
): InformationPocClient {
  return {
    search: async (params) => {
      const response = await fetch(`${opts.baseUrl}/query`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `${response.statusText}: Failed to fetch search results`
        );
      }

      return await response.json();
    },
  };
}
