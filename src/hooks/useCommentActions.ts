'use client';

import { proxyClient } from '@/lib/proxyClient';

export const useCommentActions = (
  formId: string,
  answerId: number | string
) => {
  const sendComment = async (content: string): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.POST(
      '/forms/{form_id}/answers/{answer_id}/comments',
      {
        params: {
          path: { form_id: formId, answer_id: String(answerId) },
        },
        body: { content },
      }
    );
    return { ok: response.ok };
  };

  const deleteComment = async (commentId: number): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.DELETE(
      '/forms/{form_id}/answers/{answer_id}/comments/{comment_id}',
      {
        params: {
          path: {
            form_id: formId,
            answer_id: String(answerId),
            comment_id: String(commentId),
          },
        },
      }
    );
    return { ok: response.ok };
  };

  return { sendComment, deleteComment };
};
