'use client';

import { useSWRConfig } from 'swr';

import { handleMutationResponse } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import type { AnswerComment } from '@/lib/api-types';
import { proxyClient } from '@/lib/proxyClient';

type CommentActionResult = {
  ok: boolean;
  forbidden?: boolean;
  attachmentsFailed?: boolean;
};

export const useCommentActions = (
  formId: string,
  answerId: string,
  currentUserId: string | undefined
) => {
  const { mutate } = useSWRConfig();
  const commentsKey = [
    '/api/v1/forms/{form_id}/answers/{answer_id}/comments',
    { path: { form_id: formId, answer_id: answerId } },
  ];

  const uploadCommentAttachments = async (
    commentId: string,
    files: File[]
  ): Promise<CommentActionResult> => {
    const body = new FormData();
    for (const file of files) {
      body.append('file', file);
    }
    const { data, error, response } = await proxyClient.POST(
      '/api/v1/forms/{form_id}/answers/{answer_id}/comments/{comment_id}/attachments',
      {
        params: {
          path: {
            form_id: formId,
            answer_id: answerId,
            comment_id: commentId,
          },
        },
        body,
      }
    );
    const result = handleMutationResponse(response, data, error);
    if (result.success) {
      void mutate(commentsKey).catch(() => {});
      return { ok: true };
    }

    return { ok: false, ...(result.forbidden ? { forbidden: true } : {}) };
  };

  const sendComment = async (
    content: string,
    files: File[] = []
  ): Promise<CommentActionResult> => {
    const { data, error, response } = await proxyClient.POST(
      '/api/v1/forms/{form_id}/answers/{answer_id}/comments',
      {
        params: {
          path: { form_id: formId, answer_id: answerId },
        },
        body: { content },
      }
    );
    const result = handleMutationResponse(response, data, error);
    if (!result.success) {
      return { ok: false, ...(result.forbidden ? { forbidden: true } : {}) };
    }

    if (files.length === 0) {
      void mutate(commentsKey).catch(() => {});
      return { ok: true };
    }

    // POST はコメント本文の投稿に成功しても作成された comment_id を返さないため、
    // 一覧を再取得して「自分が今投稿した内容と一致する最新のコメント」を
    // 突き合わせて特定する。同一ユーザーが同じ本文を過去に投稿していても、
    // 今作成された分が必ず最新の timestamp を持つため安全に判定できる。
    const updated = await mutate<AnswerComment[]>(commentsKey).catch(
      () => undefined
    );
    const newest = (updated ?? [])
      .filter(
        (comment) =>
          comment.content === content &&
          comment.commented_by?.uuid === currentUserId
      )
      .reduce<AnswerComment | undefined>(
        (latest, comment) =>
          !latest || comment.timestamp > latest.timestamp ? comment : latest,
        undefined
      );

    if (!newest) {
      return { ok: true, attachmentsFailed: true };
    }

    const attachmentResult = await uploadCommentAttachments(newest.id, files);
    return {
      ok: true,
      ...(attachmentResult.ok ? {} : { attachmentsFailed: true }),
    };
  };

  const deleteComment = async (
    commentId: string
  ): Promise<CommentActionResult> => {
    const { data, error, response } = await proxyClient.DELETE(
      '/api/v1/forms/{form_id}/answers/{answer_id}/comments/{comment_id}',
      {
        params: {
          path: {
            form_id: formId,
            answer_id: answerId,
            comment_id: commentId,
          },
        },
      }
    );
    const result = handleMutationResponse(response, data, error);
    if (result.success) {
      void mutate(commentsKey).catch(() => {});
      return { ok: true };
    }

    return { ok: false, ...(result.forbidden ? { forbidden: true } : {}) };
  };

  const updateComment = async (
    commentId: string,
    content: string
  ): Promise<CommentActionResult> => {
    const { data, error, response } = await proxyClient.PATCH(
      '/api/v1/forms/{form_id}/answers/{answer_id}/comments/{comment_id}',
      {
        params: {
          path: {
            form_id: formId,
            answer_id: answerId,
            comment_id: commentId,
          },
        },
        body: { content },
      }
    );
    const result = handleMutationResponse(response, data, error);
    if (result.success) {
      void mutate(commentsKey).catch(() => {});
      return { ok: true };
    }

    return { ok: false, ...(result.forbidden ? { forbidden: true } : {}) };
  };

  const deleteCommentAttachment = async (
    attachmentId: string
  ): Promise<CommentActionResult> => {
    const { data, error, response } = await proxyClient.DELETE(
      '/api/v1/forms/{form_id}/answers/{answer_id}/comments/attachments/{attachment_id}',
      {
        params: {
          path: {
            form_id: formId,
            answer_id: answerId,
            attachment_id: attachmentId,
          },
        },
      }
    );
    const result = handleMutationResponse(response, data, error);
    if (result.success) {
      void mutate(commentsKey).catch(() => {});
      return { ok: true };
    }

    return { ok: false, ...(result.forbidden ? { forbidden: true } : {}) };
  };

  return {
    sendComment: useSingleFlightAction(sendComment),
    deleteComment: useSingleFlightAction(deleteComment),
    updateComment: useSingleFlightAction(updateComment),
    deleteCommentAttachment: useSingleFlightAction(deleteCommentAttachment),
  };
};
