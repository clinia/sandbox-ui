import type { NextRequest } from 'next/server';
import { SummarizerClient } from '@clinia/tritonclient';

export const dynamic = 'force-dynamic';

const INFERENCE_URL = process.env.INFERENCE_URL ?? 'http://127.0.0.1:8001';
const MODEL_NAME =
  process.env.INFERENCE_MODEL_NAME ?? 'summarizer_medical_journals_qa';
const MODEL_VERSION = process.env.INFERENCE_MODEL_VERSION ?? '120240905190000';
const client = new SummarizerClient(INFERENCE_URL);

type InferParameter = {
  parameterChoice: {
    value: boolean;
  };
};
const colors = [
  '\x1b[31m', // Red
  '\x1b[32m', // Green
  '\x1b[33m', // Yellow
  '\x1b[34m', // Blue
  '\x1b[35m', // Magenta
  '\x1b[36m', // Cyan
  '\x1b[91m', // Bright Red
  '\x1b[92m', // Bright Green
  '\x1b[93m', // Bright Yellow
  '\x1b[94m', // Bright Blue
];
const resetColor = '\x1b[0m'; // Reset color

function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function shrinkText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export async function POST(request: NextRequest) {
  const { query, articles, mode } = (await request.json()) as {
    query: string;
    articles: string[];
    mode?: string;
  };
  const maxChars = 25;
  const start = Date.now();
  const color = getRandomColor();
  console.log(
    `Received request with query: ${color}${shrinkText(query, maxChars)}${resetColor}`
  );
  const logEnd = () => {
    console.log(
      `Inference took ${'\x1b[36m'}${Date.now() - start}ms${resetColor} for query ${color}${shrinkText(query, maxChars)}${resetColor}`
    );
  };

  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  const answerStream = client.streamAnswer(
    MODEL_NAME,
    MODEL_VERSION,
    query,
    articles,
    mode ?? 'answer'
  );

  (async () => {
    for await (const chunk of answerStream) {
      // Assuming the text is in a property called 'text' in the chunk
      const isFinished: InferParameter | undefined = chunk.inferResponse
        ?.parameters['triton_final_response'] as InferParameter | undefined;
      if (isFinished?.parameterChoice.value) {
        logEnd();
        await writer.close();
        return;
      }

      const bytes = chunk.inferResponse?.rawOutputContents?.[0];
      if (bytes === undefined || bytes.length <= 4) {
        await writer.close();
        return;
      }

      // Uncomment for debugging
      // const text = new TextDecoder().decode(bytes?.slice(4));
      // console.log(`Got chunk = ${text}`);
      writer.write(bytes?.slice(4));
    }

    logEnd();
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
