'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';

export const useCommentActions = (formId: string, answerId: string) => {
  const sendComment = async (content: string): Promise<{ ok: boolean }> => {
    const { data, response } = await proxyClient.POST(
      '/forms/{form_id}/answers/{answer_id}/comments',
      {
        params: {
          path: { form_id: formId, answer_id: answerId },
        },
        body: { content },
      }
    );
    const result = await handleMutationResponse(response, data);
    return { ok: result.success };
  };

  const deleteComment = async (commentId: string): Promise<{ ok: boolean }> => {
    const { data, response } = await proxyClient.DELETE(
      '/forms/{form_id}/answers/{answer_id}/comments/{comment_id}',
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
    const result = await handleMutationResponse(response, data);
    return { ok: result.success };
  };

  return { sendComment, deleteComment };
};
