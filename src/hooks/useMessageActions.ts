'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';

type MessageActionResult = { success: boolean; forbidden?: boolean };

export const useMessageActions = (formId: string, answerId: string) => {
  const updateMessage = async (
    messageId: string,
    body: string
  ): Promise<MessageActionResult> => {
    const { data, error, response } = await proxyClient.PATCH(
      '/forms/{form_id}/answers/{answer_id}/messages/{message_id}',
      {
        params: {
          path: {
            form_id: formId,
            answer_id: answerId,
            message_id: messageId,
          },
        },
        body: { body },
      }
    );

    const result = handleMutationResponse(response, data, error);
    if (result.success) {
      return { success: true };
    }
    return { success: false, ...(result.forbidden ? { forbidden: true } : {}) };
  };

  const deleteMessage = async (
    messageId: string
  ): Promise<MessageActionResult> => {
    const { data, error, response } = await proxyClient.DELETE(
      '/forms/{form_id}/answers/{answer_id}/messages/{message_id}',
      {
        params: {
          path: {
            form_id: formId,
            answer_id: answerId,
            message_id: messageId,
          },
        },
      }
    );

    const result = handleMutationResponse(response, data, error);
    if (result.success) {
      return { success: true };
    }
    return { success: false, ...(result.forbidden ? { forbidden: true } : {}) };
  };

  return { updateMessage, deleteMessage };
};
