'use client';

import { useRouter } from 'next/navigation';

import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import type { GetAnswersPageResponse } from '@/lib/api-types';

import { toMyAnswerListRows } from './myAnswerListRows';
import type { MyAnswerListRow } from './myAnswerListRows';
import MyAnswersView from './MyAnswersView';

const MyAnswersPageContent = ({
  initialAnswers,
  currentUserId,
}: {
  initialAnswers: GetAnswersPageResponse;
  currentUserId: string;
}) => {
  const router = useRouter();

  const { items, hasMore, isLoadingMore, sentinelRef } = useInfiniteApiQuery(
    '/api/v1/forms/answers',
    (cursor) => ({
      query: {
        user: currentUserId,
        ...(cursor === undefined ? {} : { cursor }),
      },
    }),
    initialAnswers
  );

  const rows = toMyAnswerListRows(items);

  const handleRowClick = (row: MyAnswerListRow) => {
    router.push(`/forms/${row.formId}/answers/${row.id}`);
  };

  return (
    <MyAnswersView
      rows={rows}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      sentinelRef={sentinelRef}
      onRowClick={handleRowClick}
    />
  );
};

export default MyAnswersPageContent;
