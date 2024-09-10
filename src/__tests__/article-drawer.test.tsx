import { ArticleDrawer } from '@/components/article-drawer';
import { useSearchLayout } from '@/components/search-layout';
import { cleanup, render, screen } from '@testing-library/react';
import { Mock, afterEach, expect, test, vi } from 'vitest';
import { V1Hit } from '@clinia/client-datapartition';

vi.mock('@/components/search-layout', () => ({
  useSearchLayout: vi.fn(),
}));

const mockUseSearchLayout = useSearchLayout as Mock;

afterEach(() => {
  cleanup();
});

test('ArticleDrawer displays hits in the correct order', () => {
  const mockHit: V1Hit = {
    resource: {
      data: {
        title: 'Test Article',
      },
    },
    highlighting: {
      'abstract.passages.0': [
        {
          type: 'vector',
          path: 'abstract.passages.0',
          data: 'Highlight 1',
          score: 0.3,
        },
        {
          type: 'textual',
          highlight: 'I am not displayed',
        },
      ],
      'content.0.text.passages': [
        {
          type: 'vector',
          path: 'content.0.text.passages.0',
          data: 'Highlight 2',
          score: 0.4,
        },
        {
          type: 'vector',
          path: 'content.0.text.passages.1',
          data: 'Highlight 3',
          score: 0.6,
        },
        {
          type: 'vector',
          path: 'content.0.text.passages.2',
          data: 'Highlight 4',
          score: 0.5,
        },
      ],
      'content.1.text.passages': [
        {
          type: 'vector',
          path: 'content.1.text.passages.0',
          data: 'Highlight 5',
          score: 0.44,
        },
        {
          type: 'vector',
          path: 'content.1.text.passages.1',
          data: 'Highlight 6',
          score: 0.43,
        },
      ],
    },
  };

  mockUseSearchLayout.mockReturnValue({
    hit: mockHit,
    setHit: vi.fn(),
  });

  render(<ArticleDrawer />);

  const highlights = screen.getAllByTestId('highlight');
  expect(highlights).toHaveLength(6);
  for (let i = 0; i < 6; i++) {
    expect(highlights[i]).toBeVisible();
    expect(highlights[i]).toHaveTextContent(`Highlight ${i + 1}`);
  }
});

test('ArticleDrawer displays text highlights when there are no vector highlights', () => {
  const mockHit: V1Hit = {
    resource: {
      data: {
        title: 'Test Article',
      },
    },
    highlighting: {
      'abstract.passages.0': [
        {
          type: 'textual',
          highlight: 'Highlight 1',
        },
      ],
      'content.0.text.passages': [
        {
          type: 'textual',
          highlight: 'Highlight 2',
        },
      ],
    },
  };

  mockUseSearchLayout.mockReturnValue({
    hit: mockHit,
    setHit: vi.fn(),
  });

  render(<ArticleDrawer />);

  const highlights = screen.queryAllByTestId('highlight');
  expect(highlights).toHaveLength(2);
  expect(highlights[0]).toHaveTextContent('Highlight 1');
  expect(highlights[1]).toHaveTextContent('Highlight 2');
});

test('ArticleDrawer displays no highlights when there are no highlights', () => {
  const mockHit = {
    resource: {
      data: {
        title: 'Test Article',
      },
    },
    highlighting: {},
  };

  mockUseSearchLayout.mockReturnValue({
    hit: mockHit,
    setHit: vi.fn(),
  });

  render(<ArticleDrawer />);

  const highlights = screen.queryAllByTestId('highlight');
  expect(highlights).toHaveLength(0);
});
