import { v4 as uuidv4 } from 'uuid';
import type { NextRequest } from 'next/server';
import { SummarizerClient } from '@clinia/tritonclient';
import type { SearchResponse } from '../../../lib/client/types';

const cache = new Map<string, ReturnType<SummarizerClient['streamAnswer']>>();
export const dynamic = 'force-dynamic';

const TRITON_URL = 'http://127.0.0.1:57349';
const client = new SummarizerClient(TRITON_URL);
const MODEL_NAME = 'summarizer_medical_journals_qa';
const MODEL_VERSION = '120240905190000';

export async function GET(request: NextRequest) {
  // Retrieve the query ID from the request
  const queryId = request.nextUrl.searchParams.get('queryId');
  if (!queryId) {
    return new Response('Missing queryId', { status: 400 });
  }

  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const cachedStream = cache.get(queryId);
  if (!cachedStream) {
    return new Response('Query not found', { status: 404 });
  }

  (async () => {
    for await (const chunk of cachedStream) {
      // Assuming the text is in a property called 'text' in the chunk
      const bytes = chunk.inferResponse?.rawOutputContents?.[0];
      if (bytes === undefined || bytes.length <= 4) {
        await writer.close();
        return;
      }

      const text = new TextDecoder().decode(bytes?.slice(4));
      writer.write(encoder.encode(`data: ${text}\n\n`));
    }

    await writer.close();
  })();

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}

export async function POST(request: NextRequest) {
  const { query, articles, mode } = (await request.json()) as {
    query: string;
    articles: string[];
    mode?: string;
  };

  const queryId = uuidv4();

  const out: SearchResponse = {
    hits: [],
    meta: {
      queryId,
      queryIntent: 'QUESTION',
      questions: [],
    },
  };

  cache.set(
    queryId,
    client.streamAnswer(
      MODEL_NAME,
      MODEL_VERSION,
      query,
      articles,
      mode ?? 'answer'
    )
  );
  return new Response(JSON.stringify(out), { status: 200 });
}
