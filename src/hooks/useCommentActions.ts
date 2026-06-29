'use client';

import { handleMutationResponse } from '@/hooks/useApiMutation';
import { proxyClient } from '@/lib/proxyClient';

type CommentActionResult = { ok: boolean; forbidden?: boolean };

export const useCommentActions = (formId: string, answerId: string) => {
  const sendComment = async (content: string): Promise<CommentActionResult> => {
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
    if (result.success) {
      return { ok: true };
    }

    return { ok: false, ...(result.forbidden ? { forbidden: true } : {}) };
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
      return { ok: true };
    }

    return { ok: false, ...(result.forbidden ? { forbidden: true } : {}) };
  };

  return { sendComment, deleteComment };
};
