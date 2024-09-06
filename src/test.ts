import { EmbedderClient, SummarizerClient } from '@clinia/tritonclient';

const testEmbedder = async () => {
  // Example
  const TRITON_URL = 'http://127.0.0.1:65055';
  const MODEL_NAME = 'embedder_medical_journals_qa';
  const MODEL_VERSION = '120240905185426';

  const TEXTS = ['Hello, how are you?', 'Clinia is based in Montreal'];

  const client = new EmbedderClient(TRITON_URL);

  console.log(`Created EmbedderClient, getting embeddings for texts: ${TEXTS}`);
  client
    .getEmbeddings(MODEL_NAME, MODEL_VERSION, TEXTS)
    .then((embeddings) => console.log(embeddings))
    .catch((error) => console.error(error));
};

const testSummarizer = async () => {
  // Example
  const TRITON_URL = 'http://127.0.0.1:59307';
  const MODEL_NAME = 'summarizer_medical_journals_qa';
  const MODEL_VERSION = '120240905190000';

  const client = new SummarizerClient(TRITON_URL);

  const query = 'How can we find bone defects?';
  const articles = [
    '{"id": "test-id-1", "text": "", "title": "Process of finding bone problems", "passages": ["Bone defects can be found by means of a bone scanner"]}',
    '{"id": "test-id-2", "text": "", "title": "Process of finding mind problems", "passages": ["Mind problems are the field of a psychologist"]}',
  ];
  const mode = 'answer';
  client
    .getAnswer(MODEL_NAME, MODEL_VERSION, query, articles, mode)
    .then((embeddings) => console.log(embeddings))
    .catch((error) => console.error(error));
};

testSummarizer();
