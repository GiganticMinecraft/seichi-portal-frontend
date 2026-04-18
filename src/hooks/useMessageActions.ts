'use client';

import { errorResponseSchema } from '@/lib/api-types';
import { proxyClient } from '@/lib/proxyClient';

type MessageActionResult = { success: boolean; forbidden?: boolean };

const parseForbidden = async (response: Response): Promise<boolean> => {
  try {
    const json = await response.json();
    const parseResult = errorResponseSchema.safeParse(json);
    return parseResult.success && parseResult.data.errorCode === 'FORBIDDEN';
  } catch {
    return false;
  }
};

export const useMessageActions = (formId: string, answerId: number) => {
  const updateMessage = async (
    messageId: string,
    body: string
  ): Promise<MessageActionResult> => {
    const { response } = await proxyClient.PATCH(
      '/forms/{form_id}/answers/{answer_id}/messages/{message_id}',
      {
        params: {
          path: {
            form_id: formId,
            answer_id: String(answerId),
            message_id: messageId,
          },
        },
        body: { body },
      }
    );

    if (response.ok) {
      return { success: true };
    }

    const forbidden = await parseForbidden(response);
    return { success: false, forbidden };
  };

  const deleteMessage = async (
    messageId: string
  ): Promise<MessageActionResult> => {
    const { response } = await proxyClient.DELETE(
      '/forms/{form_id}/answers/{answer_id}/messages/{message_id}',
      {
        params: {
          path: {
            form_id: formId,
            answer_id: String(answerId),
            message_id: messageId,
          },
        },
      }
    );

    if (response.ok) {
      return { success: true };
    }

    const forbidden = await parseForbidden(response);
    return { success: false, forbidden };
  };

  return { updateMessage, deleteMessage };
};
