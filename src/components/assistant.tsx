'use client';

import { CircleAlertIcon, RefreshCw, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useCallback, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { V1Hit } from '@clinia/client-common';
import { useHits, useLoading, useQuery } from '@clinia/search-sdk-react';
import { Button } from '@clinia-ui/react';
import styles from './assistant.module.css';
import { useStreamRequest } from './use-stream-request';

export type AssistantProps = {
  className?: string;
};

export const Assistant = ({ className }: AssistantProps) => {
  const hits = useHits();
  const querying = useLoading();
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
        <AssistantListener
          querying={querying}
          hits={hits as any}
          query={query}
        />
      </div>
      <footer></footer>
    </div>
  );
};

type AssistantListenerProps = {
  query: string;
  querying: boolean;
  hits: V1Hit[];
};
const AssistantListener = ({
  hits,
  query,
  querying,
}: AssistantListenerProps) => {
  const [summary, setSummary] = useState('');
  // Little hack to ensure we do not display the error message between assistant requests
  const [disableErrors, setDisableErrors] = useState(true);
  const queryRef = useRef(query);

  useEffect(() => {
    // We store the query in a ref so that we only refetch the assistant when new articles are coming.
    // This avoids doing a double-query in between the request-response from the query API.
    queryRef.current = query;
    setSummary('');
    setDisableErrors(true);
  }, [query]);

  const { refetch, status } = useStreamRequest(
    useCallback(
      (chunk: string) => {
        setSummary((s) => (s !== null ? s + chunk : chunk));
      },
      [setSummary]
    )
  );

  const handleRefetch = useCallback(() => {
    refetchHandlerFromHits(hits, queryRef.current, refetch)?.();
  }, [hits, refetch]);

  useEffect(() => {
    refetchHandlerFromHits(hits, queryRef.current, refetch)?.();
    setDisableErrors(false);
  }, [hits, refetch]);

  if (
    !querying &&
    !disableErrors &&
    (status === 'error' || (status === 'success' && summary.trim() === ''))
  ) {
    return (
      <ErrorDisplay
        disabled={['idle', 'loading'].includes(status)}
        onRetry={handleRefetch}
      />
    );
  }

  const classnames = [];
  if (status === 'loading' || status === 'idle' || querying) {
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
  onRetry?: () => void;
  disabled?: boolean;
};

const ErrorDisplay = ({ disabled, onRetry }: ErrorDisplayProps) => {
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

const refetchHandlerFromHits = (
  hits: V1Hit[],
  query: string,
  refetch: (url: string, request: RequestInit) => Promise<void>
): undefined | (() => void) => {
  if (hits.length === 0) return undefined;
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
  return () =>
    refetch(`/api/assistant`, {
      method: 'POST',
      body: JSON.stringify({
        query,
        articles: passages.slice(0, 3),
      }),
    });
};
