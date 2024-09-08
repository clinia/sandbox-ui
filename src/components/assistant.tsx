'use client';

import { Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import styles from './assistant.module.css';
import { useEventSource, useEventSourceListener } from './use-event-source';
import { useMeta } from './use-meta';

export type AssistantProps = {
  className?: string;
};

export const Assistant = ({ className }: AssistantProps) => {
  const meta = useMeta();

  if (meta.queryIntent !== 'QUESTION' || !meta.queryId) {
    return null;
  }

  return (
    <div className={twMerge('rounded-lg border p-6', className)}>
      <header className="mb-4 flex gap-4">
        <Sparkles className="stroke-primary" />
        <h1 className="text-base font-medium text-primary">Assistant</h1>
      </header>
      <div>
        <AssistantListener queryId={meta.queryId} />
      </div>
      <footer></footer>
    </div>
  );
};

type AssistantListenerProps = {
  queryId: string;
};
const AssistantListener = ({ queryId }: AssistantListenerProps) => {
  const [summary, setSummary] = useState('');

  // Reset summary every time the query ID change
  useEffect(() => setSummary(''), [queryId]);

  const [eventSource, eventSourceStatus] = useEventSource(
    `/api/assistant?queryId=${encodeURIComponent(queryId)}`,
    // `/api/query/${queryId}/answer`,
    true
  );
  useEventSourceListener(
    eventSource,
    ['message'],
    (evt) => {
      console.log(evt.data);
      setSummary((s) => s + evt.data);
    },
    [setSummary]
  );

  const classnames = [];
  if (eventSourceStatus === 'open' || eventSourceStatus === 'init') {
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
  //   return <p className={classnames.join(' ')}>{summary}</p>;
};
