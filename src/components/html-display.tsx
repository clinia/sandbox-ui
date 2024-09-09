'use client';

import sanitize from 'sanitize-html';
import { useMemo } from 'react';

type HtmlDisplayProps = {
  className?: string;
  html: string;
};

export const HtmlDisplay = ({ className, html }: HtmlDisplayProps) => {
  const sanitizedHtml = useMemo(() => sanitize(html), [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
