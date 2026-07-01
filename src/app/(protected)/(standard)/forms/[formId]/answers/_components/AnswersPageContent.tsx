'use client';

import { useRouter } from 'next/navigation';

import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import type {
  GetFormAnswersPageResponse,
  GetFormResponse,
} from '@/lib/api-types';

import { toAnswerListRows } from '../_lib/answerListRows';

import AnswersView from './AnswersView';

const AnswersPageContent = ({
  form,
  initialAnswers,
}: {
  form: GetFormResponse;
  initialAnswers: GetFormAnswersPageResponse;
}) => {
  const router = useRouter();
  const {
    items: answers,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useInfiniteApiQuery(
    '/api/v1/forms/{id}/answers',
    (cursor) => ({
      path: { id: form.id },
      query: cursor === undefined ? {} : { cursor },
    }),
    initialAnswers
  );
  const rows = toAnswerListRows(answers);

  return (
    <AnswersView
      formTitle={form.title}
      rows={rows}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={loadMore}
      onAnswerClick={(answerId) => {
        router.push(`/forms/${form.id}/answers/${answerId}`);
      }}
    />
  );
};

export default AnswersPageContent;
