import { Searchbox } from '@/components/searchbox';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();
  return (
    <div className="flex justify-center">
      <div className="w-[570px]">
        <Searchbox />
      </div>
    </div>
  );
}
