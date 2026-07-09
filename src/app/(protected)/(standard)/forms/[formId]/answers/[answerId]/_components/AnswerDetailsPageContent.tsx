'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import ErrorDialog from '@/app/_components/ErrorDialog';
import LoadingCircular from '@/app/_components/LoadingCircular';
import {
  getOptionalQueryData,
  getRequiredQueryGroupError,
  isQueryGroupReady,
} from '@/app/_swr/queryState';
import { useApiQuery } from '@/app/_swr/useApiQuery';

import AnswerDetailsPageView from './AnswerDetailsPageView';
import type { AnswerDetailsPageData } from './AnswerDetailsPageView';

const AnswerDetailsPageContent = ({
  formId,
  answerId,
}: {
  formId: string;
  answerId: string;
}) => {
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

  const answerQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    { refreshInterval: 1000 }
  );

  const { data: answer } = answerQuery;

  const formQuery = useApiQuery(
    '/api/v1/forms/{id}',
    {
      path: { id: answer?.form_id ?? '' },
    },
    { refreshInterval: 1000 }
  );

  const currentUserQuery = useApiQuery('/api/v1/users/me');

  const messagesQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/messages',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    { refreshInterval: 1000 }
  );

  const commentsQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/comments',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    { refreshInterval: 1000 }
  );

  const requiredQueries = {
    answer: answerQuery,
    form: formQuery,
    messages: messagesQuery,
    comments: commentsQuery,
  };
  const queryError = getRequiredQueryGroupError(requiredQueries);

  if (queryError !== undefined) {
    return <ErrorDialog />;
  }

  if (!isQueryGroupReady(requiredQueries)) {
    return <LoadingCircular />;
  }

  const currentUser = getOptionalQueryData(currentUserQuery);
  const data: AnswerDetailsPageData = {
    answer: requiredQueries.answer.data,
    form: requiredQueries.form.data,
    messages: requiredQueries.messages.data,
    comments: requiredQueries.comments.data,
    currentUserId: currentUser?.id,
  };

  return (
    <AnswerDetailsPageView
      formId={formId}
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

export default AnswerDetailsPageContent;
