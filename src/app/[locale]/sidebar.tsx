import Link from 'next/link';
import { CliniaIcon } from '@clinia-ui/icons';
import { Button } from '@clinia-ui/react';

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 -translate-x-full border-r transition-transform sm:translate-x-0">
      <div className="h-full overflow-y-auto px-3 py-4">
        <Button variant="link">
          <Link href="/">
            <CliniaIcon />
          </Link>
        </Button>
      </div>
    </aside>
  );
};
