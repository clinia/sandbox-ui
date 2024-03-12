import { ArticleDrawer } from '@/components/article-drawer';
import { SearchLayout, SearchLayoutDrawer } from '@/components/search-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SearchLayout>
      {children}
      <SearchLayoutDrawer>
        <ArticleDrawer />
      </SearchLayoutDrawer>
    </SearchLayout>
  );
}
