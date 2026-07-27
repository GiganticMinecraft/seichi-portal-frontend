'use client';

import { useSearchParams } from 'next/navigation';

import { useClearQueryParam } from '@/app/(protected)/_components/useClearQueryParam';
import ErrorDialog from '@/app/_components/ErrorDialog';
import LoadingCircular from '@/app/_components/LoadingCircular';
import { useCurrentUser } from '@/app/_providers/currentUser';
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
  const searchParams = useSearchParams();
  const clearQueryParam = useClearQueryParam();
  const currentUser = useCurrentUser();
  const isAdmin = currentUser.role === 'ADMINISTRATOR';

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

  // ラベル選択肢は管理者操作(ラベル編集)にのみ必要なため、管理者以外では取得しない
  const labelOptionsQuery = useApiQuery(
    '/api/v1/labels/answers',
    isAdmin ? undefined : null
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

  const data: AnswerDetailsPageData = {
    answer: requiredQueries.answer.data,
    form: requiredQueries.form.data,
    messages: requiredQueries.messages.data,
    comments: requiredQueries.comments.data,
    currentUserId: currentUser.id,
    isAdmin,
    labelOptions: getOptionalQueryData(labelOptionsQuery) ?? [],
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
