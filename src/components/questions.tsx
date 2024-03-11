'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@clinia-ui/react';
import { useMeta } from './use-meta';

type QuestionsProps = {
  title: string;
  questions: string[];
};

export const Questions = ({ title, questions }: QuestionsProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="pb-4 text-center text-base font-medium text-foreground">
        {title}
      </h1>
      {questions.map((question) => (
        <Button
          key={question}
          onClick={() => router.push(`/search?q=${question}`)}
          className="border border-primary/20 bg-accent text-accent-foreground hover:bg-primary/20"
        >
          {question}
        </Button>
      ))}
    </div>
  );
};

export const QuestionsResult = () => {
  const meta = useMeta();
  const t = useTranslations();

  if (!meta) {
    return null;
  }

  return (
    <Questions title={t('search.followUp.title')} questions={meta.questions} />
  );
};
