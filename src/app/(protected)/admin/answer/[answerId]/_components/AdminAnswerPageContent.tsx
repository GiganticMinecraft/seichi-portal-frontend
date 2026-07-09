'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import ErrorDialog from '@/app/_components/ErrorDialog';
import LoadingCircular from '@/app/_components/LoadingCircular';
import {
  getRequiredQueryGroupError,
  isQueryGroupReady,
} from '@/app/_swr/queryState';
import { useApiQuery } from '@/app/_swr/useApiQuery';

import AdminAnswerPageView from './AdminAnswerPageView';
import type { AdminAnswerPageData } from './AdminAnswerPageView';

const AdminAnswerPageContent = ({ answerId }: { answerId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clearQueryParam = useCallback(
    (key: string) => {
      if (searchParams.get(key) === null) {
        return;
      }
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const allAnswersQuery = useApiQuery('/api/v1/forms/answers', undefined, {
    refreshInterval: 1000,
  });

  const { data: allAnswers } = allAnswersQuery;
  const answers = allAnswers?.items.find((a) => a.id === answerId);

  const formQuery = useApiQuery(
    '/api/v1/forms/{id}',
    {
      path: { id: answers?.form_id ?? '' },
    },
    { refreshInterval: 1000 }
  );

  const labelsQuery = useApiQuery('/api/v1/labels/answers');

  const messagesQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/messages',
    {
      path: {
        form_id: answers?.form_id ?? '',
        answer_id: answerId,
      },
    },
    { refreshInterval: 1000 }
  );

  const commentsQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/comments',
    {
      path: {
        form_id: answers?.form_id ?? '',
        answer_id: answerId,
      },
    },
    { refreshInterval: 1000 }
  );

  const answerListQueries = { allAnswers: allAnswersQuery };
  const answerListError = getRequiredQueryGroupError(answerListQueries);

  if (answerListError !== undefined) {
    return <ErrorDialog />;
  }

  if (!isQueryGroupReady(answerListQueries)) {
    return <LoadingCircular />;
  }

  const answer = answerListQueries.allAnswers.data.items.find(
    (a) => a.id === answerId
  );

  if (answer === undefined) {
    return (
      <ErrorDialog
        status={404}
        title="回答が見つかりません"
        message="指定された回答は存在しないか、表示できません。"
      />
    );
  }

  const detailQueries = {
    form: formQuery,
    labels: labelsQuery,
    messages: messagesQuery,
    comments: commentsQuery,
  };
  const detailError = getRequiredQueryGroupError(detailQueries);

  if (detailError !== undefined) {
    return <ErrorDialog />;
  }

  if (!isQueryGroupReady(detailQueries)) {
    return <LoadingCircular />;
  }

  const data: AdminAnswerPageData = {
    answer,
    form: detailQueries.form.data,
    labels: detailQueries.labels.data,
    messages: detailQueries.messages.data,
    comments: detailQueries.comments.data,
  };

  return (
    <AdminAnswerPageView
      answerId={answerId}
      data={data}
      messageDeepLink={{
        entryId: searchParams.get('messageId') ?? undefined,
        onClose: () => {
          clearQueryParam('messageId');
        },
      }}
      commentDeepLink={{
        entryId: searchParams.get('commentId') ?? undefined,
        onClose: () => {
          clearQueryParam('commentId');
        },
      }}
    />
  );
};

export default AdminAnswerPageContent;
