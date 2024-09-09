import { V1Hit } from '@clinia/client-datapartition';

export type InformationPocClient = {
  search: <T = Resource>(params: SearchRequest) => Promise<SearchResponse<T>>;
};

export type SearchRequest = {
  query: string;
};

export type SearchResponse<T = Resource> = {
  hits: Hit<T>[];
  meta: {
    queryId: string;
  };
};

export type Hit<T = Resource> = {
  resource: T;
  highlighting?: V1Hit['highlighting'];
};

export type Resource = {
  id: string;
};

export type Article = Resource & {
  data: {
    title: string;
    abstract: string;
    content: [
      {
        title: string;
        text: string;
      },
    ];
  };
};

// Display a dumb fallback. We would ideally show `data` but if it's not respecting that shape let's fallback to `highlight`.
export type Highlight =
  | {
      highlight: string;
    }
  | {
      type: 'text';
      highlight: string;
    }
  | HitsHighlight;

export type HitsHighlight = {
  type: 'vector';
  score: number;
  data: string;
  // content.0.passages.0
  path: string;
};
