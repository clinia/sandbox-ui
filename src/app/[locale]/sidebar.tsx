'use client';

import { useRouter } from 'next/navigation';
import { CliniaIcon } from '@clinia-ui/icons';

export const Sidebar = () => {
  const router = useRouter();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 -translate-x-full border-r transition-transform sm:translate-x-0">
      <div className="h-full overflow-y-auto px-3 py-4">
        <div className="cursor-pointer p-2" onClick={() => router.push('/')}>
          <CliniaIcon />
        </div>
      </div>
    </aside>
  );
};
