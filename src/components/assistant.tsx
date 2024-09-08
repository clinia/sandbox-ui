'use client';

import { Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useCallback, useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { V1Hit } from '@clinia/client-common';
import { useHits, useQuery } from '@clinia/search-sdk-react';
import styles from './assistant.module.css';
import { useStreamRequest } from './use-stream-request';

export type AssistantProps = {
  className?: string;
};

export const Assistant = ({ className }: AssistantProps) => {
  const hits = useHits();
  const [query] = useQuery();

  return (
    <div className={twMerge('rounded-lg border p-6', className)}>
      <header className="mb-4 flex gap-4">
        <Sparkles className="stroke-primary" />
        <h1 className="text-base font-medium text-primary">Assistant</h1>
      </header>
      <div>
        <AssistantListener hits={hits as any} query={query} />
      </div>
      <footer></footer>
    </div>
  );
};

type AssistantListenerProps = {
  query: string;
  hits: V1Hit[];
};
const AssistantListener = ({ hits, query }: AssistantListenerProps) => {
  const [summary, setSummary] = useState('');

  // Reset summary every time the query changes
  useEffect(() => {
    console.log('query or hits changed');
    setSummary('');
    if (hits.length === 0) return;
    console.log(hits);
    const passages = hits.flatMap((h) =>
      (h.highlighting?.['abstract.passages'] ?? [])
        .slice(0, 1)
        .map((x) => x.highlight)
    );
    console.log(
      `Fetching assistant for ${query} and ${JSON.stringify(passages, undefined, 4)}`
    );
    refetch(`/api/assistant`, {
      method: 'POST',
      body: JSON.stringify({
        query,
        articles: passages.slice(0, 3),
      }),
    });
  }, [query, hits]);

  const { refetch, status } = useStreamRequest(
    useCallback(
      (chunk: string) => {
        console.log(chunk);
        setSummary((s) => s + chunk);
      },
      [setSummary]
    )
  );
  const classnames = [];
  if (status === 'loading' || status === 'idle') {
    classnames.push(styles.type);
  }

  return (
    <Markdown
      className={classnames.join(' ')}
      components={{
        h1: (props) => (
          <h1
            className="mb-4 text-2xl font-medium text-foreground"
            {...props}
          />
        ),
      }}
    >
      {summary}
    </Markdown>
  );
};
