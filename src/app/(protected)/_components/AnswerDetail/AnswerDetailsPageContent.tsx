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
import { isAnswerAuthoredByCurrentUser } from '@/lib/forms/answerAuthor';
import { isHttpError } from '@/lib/httpError';

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
    '/api/v1/forms/{form_id}',
    {
      path: { form_id: answer?.form_id ?? '' },
    },
    { refreshInterval: 1000 }
  );

  const isAuthor =
    answer !== undefined &&
    isAnswerAuthoredByCurrentUser(answer.author, currentUser.id, isAdmin);

  // メッセージは管理者・投稿者本人にのみ閲覧権限があるため、権限がないと
  // わかっている場合はバックエンドへリクエストしない。
  const canAccessMessages = isAdmin || isAuthor;

  const messagesQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/messages',
    canAccessMessages
      ? { path: { form_id: formId, answer_id: answerId } }
      : null,
    { refreshInterval: 1000 }
  );

  const commentsQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/comments',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    { refreshInterval: 1000 }
  );

  const relatedAnswersQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/related-answers',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    { refreshInterval: 1000 }
  );

  // 回答が非公開になっている場合、管理者以外はコメントの閲覧権限を持たない
  // (投稿者本人であっても例外はない)。事前に判定できないため、403は
  // コメントセクションのみを無効化する個別のエラーとして扱い、ページ全体の
  // 表示を妨げないようにする。
  const commentsForbidden =
    isHttpError(commentsQuery.error) && commentsQuery.error.status === 403;

  // ラベル選択肢は管理者操作(ラベル編集)にのみ必要なため、管理者以外では取得しない
  const labelOptionsQuery = useApiQuery(
    '/api/v1/labels/answers',
    isAdmin ? undefined : null
  );

  const requiredQueries = {
    answer: answerQuery,
    form: formQuery,
    relatedAnswers: relatedAnswersQuery,
  };
  const queryError =
    getRequiredQueryGroupError(requiredQueries) ??
    (commentsForbidden ? undefined : commentsQuery.error);

  if (queryError !== undefined) {
    return <ErrorDialog error={queryError} />;
  }

  const commentsReady =
    commentsForbidden ||
    (!commentsQuery.isLoading && commentsQuery.data !== undefined);

  if (!isQueryGroupReady(requiredQueries) || !commentsReady) {
    return <LoadingCircular />;
  }

  const data: AnswerDetailsPageData = {
    answer: requiredQueries.answer.data,
    form: requiredQueries.form.data,
    messages: getOptionalQueryData(messagesQuery) ?? [],
    comments: commentsForbidden ? [] : (commentsQuery.data ?? []),
    commentsDisabled: commentsForbidden,
    relatedAnswers: requiredQueries.relatedAnswers.data,
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
