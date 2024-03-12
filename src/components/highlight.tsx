import { Highlight } from '@/lib/client';

export const PassageHighlight = ({ highlight }: { highlight: Highlight }) => {
  if (highlight.type !== 'passage') {
    return null;
  }

  const sentenceHighlight = highlight.highlight;
  if (sentenceHighlight?.type === 'sentence') {
    return (
      <SentenceHighlight highlight={sentenceHighlight} passage={highlight} />
    );
  }

  return <p className="text-sm text-muted-foreground">{highlight.match}</p>;
};

export const SentenceHighlight = ({
  highlight,
  passage,
}: {
  highlight: Highlight;
  passage: Highlight;
}) => {
  // We get the start offset of the sentence with respect to the passage
  const startOffset = highlight.startOffset - passage.startOffset;
  const start = passage.match.slice(passage.startOffset, startOffset);

  // We get the end offset of the sentence with respect to the passage
  const endOffset = highlight.endOffset - passage.startOffset;
  const end = passage.match.slice(endOffset);

  return (
    <p className="text-sm text-muted-foreground">
      {start}
      <mark className="bg-primary/20">{highlight.match}</mark>
      {end}
    </p>
  );
};
