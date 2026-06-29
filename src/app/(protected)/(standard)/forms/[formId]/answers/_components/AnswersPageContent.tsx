'use client';

import { useRouter } from 'next/navigation';
import AnswersView from './AnswersView';
import { toAnswerListRows } from '../_lib/answerListRows';
import type { GetFormAnswersResponse, GetFormResponse } from '@/lib/api-types';

const AnswersPageContent = ({
  form,
  answers,
}: {
  form: GetFormResponse;
  answers: GetFormAnswersResponse;
}) => {
  const router = useRouter();
  const rows = toAnswerListRows(answers);

  return (
    <AnswersView
      formTitle={form.title}
      rows={rows}
      onAnswerClick={(answerId) => {
        router.push(`/forms/${form.id}/answers/${answerId}`);
      }}
    />
  );
};

export default AnswersPageContent;
