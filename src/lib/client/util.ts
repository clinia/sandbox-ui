import type { Highlight } from './types';

export const getHighlightText = (highlight: Highlight): string => {
  if ('highlight' in highlight) {
    return highlight.highlight;
  }

  if (highlight.type === 'hits' || 'data' in highlight) {
    return highlight.data;
  }

  return '';
};
