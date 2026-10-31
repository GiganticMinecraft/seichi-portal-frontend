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
import { retryUnlessNotFound } from '@/app/_swr/retry';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import { isAnswerAuthoredByCurrentUser } from '@/lib/forms/answerAuthor';
import { resolveAnswerUnavailableReason } from '@/lib/forms/answerUnavailable';
import { isHttpError } from '@/lib/httpError';

import AnswerDetailsPageView from './AnswerDetailsPageView';
import type { AnswerDetailsPageData } from './AnswerDetailsPageView';
import AnswerUnavailable from './AnswerUnavailable';

/**
 * 回答詳細を構成する各クエリのポーリング間隔。1 秒間隔ではタブ 1 枚あたり
 * backend へ毎秒 5〜7 リクエスト (本体・フォーム・メッセージ・コメント・
 * 関連回答と、Conversation 側の変更履歴) が飛び、7 日間の backend リクエストの
 * 大半をこのページのポーリングが占めていた。他者の編集が数秒遅れて見える程度は
 * 許容できるので 5 秒にする。SWR の既定でタブが非表示の間は停止する。
 */
export const ANSWER_DETAIL_REFRESH_INTERVAL_MS = 5000;

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
    {
      refreshInterval: ANSWER_DETAIL_REFRESH_INTERVAL_MS,
      onErrorRetry: retryUnlessNotFound,
    }
  );

  const { data: answer } = answerQuery;

  const formQuery = useApiQuery(
    '/api/v1/forms/{form_id}',
    {
      path: { form_id: answer?.form_id ?? '' },
    },
    {
      refreshInterval: ANSWER_DETAIL_REFRESH_INTERVAL_MS,
      onErrorRetry: retryUnlessNotFound,
    }
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
    {
      refreshInterval: ANSWER_DETAIL_REFRESH_INTERVAL_MS,
      onErrorRetry: retryUnlessNotFound,
    }
  );

  const commentsQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/comments',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    {
      refreshInterval: ANSWER_DETAIL_REFRESH_INTERVAL_MS,
      onErrorRetry: retryUnlessNotFound,
    }
  );

  const relatedAnswersQuery = useApiQuery(
    '/api/v1/forms/{form_id}/answers/{answer_id}/related-answers',
    {
      path: { form_id: formId, answer_id: answerId },
    },
    {
      refreshInterval: ANSWER_DETAIL_REFRESH_INTERVAL_MS,
      onErrorRetry: retryUnlessNotFound,
    }
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

  // 通知や検索結果のリンク先がアーカイブ済み・削除済みのとき、回答本体・関連回答・
  // コメントのどれが先に 404 を返すかは分からないので、まとめて判定する
  // (フォームのクエリは回答が取れるまで始まらないため含めない)。
  const unavailableReason = resolveAnswerUnavailableReason([
    answerQuery.error,
    relatedAnswersQuery.error,
    commentsQuery.error,
  ]);

  // 管理者には復元の導線を示したいので、フォームが見つからないときだけ
  // アーカイブ済みフォームを引く。削除済みなら 404 になるが、それは表示に使わない。
  const archivedFormQuery = useApiQuery(
    '/api/v1/archived-forms/{form_id}',
    isAdmin && unavailableReason === 'form-not-found'
      ? { path: { form_id: formId } }
      : null,
    { shouldRetryOnError: false }
  );

  if (unavailableReason !== undefined) {
    return (
      <AnswerUnavailable
        reason={unavailableReason}
        formId={formId}
        isAdmin={isAdmin}
        archivedFormTitle={archivedFormQuery.data?.title}
      />
    );
  }

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
