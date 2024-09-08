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
  highlighting?: Record<string, Highlight[]>;
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

export type Highlight = {
  highlight: string;
};
