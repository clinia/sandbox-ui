export type InformationPocClient = {
    search: <T = Resource>(params: SearchRequest) => Promise<SearchResponse<T>>;
};


export type SearchRequest = {
    query: string;
}

export type SearchResponse<T = Resource> = {
    hits: Hit<T>[];
    meta: {
        queryId: string
        queryIntent: 'QUESTION'
        questions: string[]
    }
}

export type Hit<T = Resource> = {
    resource: T;
    highlight: Highlight[];
    enrichers: Enrichers;
}


export type Resource = {
    id: string;
    [key: string]: any;
}

export type Article = Resource & {
    title: string;
    text: string;
}

export type Highlight = {
    match: string;
    startOffset: number;
    endOffset: number;
    type: 'passage' | 'sentence';
    highlight?: Highlight;
    score: number;
}

export type Enrichers = {
    questions: string[];
}