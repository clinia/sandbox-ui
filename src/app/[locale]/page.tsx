import { Searchbox } from '@/components/searchbox';
import { useTranslations } from 'next-intl';
import { Badge, Button } from '@clinia-ui/react';

export default function Home() {
  const t = useTranslations();
  return (
    <div className="grid justify-items-center">
      <div className="w-[570px] py-80">
        <Searchbox />
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="pb-4 text-center text-base font-medium text-foreground">
          {t('home.questions.title')}
        </h1>
        <Button>How long to recover from ACL tear?</Button>
        <Button>How reliable are COVID tests?</Button>
      </div>
    </div>
  );
}
