'use client';

import { CircleAlertIcon, RefreshCw, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useCallback, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { V1Hit } from '@clinia/client-common';
import { useHits, useQuery } from '@clinia/search-sdk-react';
import { Button } from '@clinia-ui/react';
import styles from './assistant.module.css';
import { useStreamRequest } from './use-stream-request';

export type AssistantProps = {
  className?: string;
};

export const Assistant = ({ className }: AssistantProps) => {
  const hits = useHits();
  const [query] = useQuery();
  const [seenHits, setSeenHits] = useState(false);
  useEffect(() => {
    if (hits.length > 0) {
      setSeenHits(true);
    }
  }, [hits]);

  if (!seenHits) {
    return null;
  }

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
  const queryRef = useRef(query);

  useEffect(() => {
    // We store the query in a ref so that we only refetch the assistant when new articles are coming.
    // This avoids doing a double-query in between the request-response from the query API.
    queryRef.current = query;
    setSummary('');
  }, [query]);

  const { refetch, status } = useStreamRequest(
    useCallback(
      (chunk: string) => {
        setSummary((s) => s + chunk);
      },
      [setSummary]
    )
  );

  // Reset summary every time the query changes
  useEffect(() => {
    if (hits.length === 0) return;
    const passages = hits.flatMap((h) =>
      (h.highlighting?.['abstract.passages'] ?? []).slice(0, 1).map((x) =>
        JSON.stringify({
          id: h.resource.id,
          text: '',
          title: h.resource.data.title,
          passages: [x.highlight],
        })
      )
    );
    refetch(`/api/assistant`, {
      method: 'POST',
      body: JSON.stringify({
        query: queryRef.current,
        articles: passages.slice(0, 3),
      }),
    });
  }, [hits, refetch]);

  return <ErrorDisplay />;
  if (status === 'error' || (status === 'success' && summary.trim() === '')) {
    return <ErrorDisplay />;
  }

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

type ErrorDisplayProps = {
  loading?: boolean;
  onRetry?: () => void;
  disabled?: boolean;
};

const ErrorDisplay = ({ disabled, loading, onRetry }: ErrorDisplayProps) => {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-accent p-2.5 text-sm">
      <CircleAlertIcon className="text-accent-foreground" />
      <div className="flex flex-1 flex-col">
        <h3 className="font-medium text-accent-foreground">
          Couldn't generate a summary
        </h3>
        <p className="text-accent-foreground">
          You can still browse results below, or try regenerating a summary
        </p>
      </div>
      {onRetry ? (
        <Button
          type="button"
          className="items-center justify-center gap-2"
          loading={loading}
          disabled={disabled}
          onClick={onRetry}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      ) : null}
    </div>
  );
};
