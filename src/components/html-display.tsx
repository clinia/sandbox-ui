'use client';

import sanitize from 'sanitize-html';
import { useMemo } from 'react';

type HtmlDisplayProps = {
  className?: string;
  html: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const HtmlDisplay = ({
  className,
  html,
  ...props
}: HtmlDisplayProps) => {
  const sanitizedHtml = useMemo(() => sanitize(html), [html]);

  return (
    <div
      {...props}
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
