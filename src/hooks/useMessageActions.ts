'use client';

import * as sdk from '@/generated/api/sdk.gen';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

type MessageActionResult = { success: boolean; forbidden?: boolean };

export const useMessageActions = (formId: string, answerId: string) => {
  const updateMessage = async (
    messageId: string,
    body: string
  ): Promise<MessageActionResult> => {
    const { data, error, response } = await withResponse(
      sdk.updateMessageHandler({
        client: proxyClient,
        path: {
          form_id: formId,
          answer_id: answerId,
          message_id: messageId,
        },
        body: { body },
      })
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
    const { data, error, response } = await withResponse(
      sdk.deleteMessageHandler({
        client: proxyClient,
        path: {
          form_id: formId,
          answer_id: answerId,
          message_id: messageId,
        },
      })
    );

    const result = handleMutationResponse(response, data, error);
    if (result.success) {
      return { success: true };
    }
    return { success: false, ...(result.forbidden ? { forbidden: true } : {}) };
  };

  return {
    updateMessage: useSingleFlightAction(updateMessage),
    deleteMessage: useSingleFlightAction(deleteMessage),
  };
};
