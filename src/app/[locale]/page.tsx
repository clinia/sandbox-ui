import { Questions } from '@/components/questions';
import { Searchbox } from '@/components/searchbox';
import { useI18nRouter } from '@/lib/use-i18n-router';
import { useTranslations } from 'next-intl';

const questions = [
  'How long to recover from ACL tear?',
  'How reliable are COVID tests?',
];

export default function Home() {
  const t = useTranslations();

  return (
    <div className="grid justify-items-center">
      <div className="w-[570px] py-80">
        <Searchbox />
      </div>
      <div>
        <Questions title={t('home.questions.title')} questions={questions} />
      </div>
    </div>
  );
}
