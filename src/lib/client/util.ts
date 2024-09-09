import {
  V1HighlightingHit,
  V1HighlightingHitVector,
} from '@clinia/client-common';

export const getHighlightText = (highlight: V1HighlightingHit): string => {
  if ('highlight' in highlight) {
    return highlight.highlight;
  }

  if (highlight.type === 'vector' || 'data' in highlight) {
    return highlight.data;
  }

  return '';
};

export const isVectorHighlight = (
  highlight: V1HighlightingHit
): highlight is V1HighlightingHitVector => {
  return 'type' in highlight && highlight.type === 'vector';
};
