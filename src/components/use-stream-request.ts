import { useCallback, useRef, useState } from 'react';

type StreamRequestStatus = 'idle' | 'loading' | 'error' | 'success';

export function useStreamRequest(onData: (data: string) => void) {
  const [status, setStatus] = useState<StreamRequestStatus>('idle');
  const controllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(
    async (url: string, request: RequestInit) => {
      setStatus('loading');
      if (controllerRef.current) {
        console.warn('Aborting previous request');
        controllerRef.current.abort();
      }
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            Accept: 'text/event-stream',
          },
          ...request,
        });

        if (!response.body) {
          throw new Error('ReadableStream not supported in this environment.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            onData(chunk);
          }
        }

        setStatus('success');
      } catch (error) {
        if ((error as Error)?.name !== 'AbortError') {
          setStatus('error');
        }
      }
    },
    [onData]
  );

  return { refetch, status };
}
