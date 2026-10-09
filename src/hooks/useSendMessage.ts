'use client';

import { useSWRConfig } from 'swr';

import * as sdk from '@/generated/api/sdk.gen';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

type SendMessageResult = { success: boolean; forbidden?: boolean };

export const useSendMessage = (formId: string, answerId: string) => {
  const { mutate } = useSWRConfig();
  const messagesKey = [
    '/api/v1/forms/{form_id}/answers/{answer_id}/messages',
    { path: { form_id: formId, answer_id: answerId } },
  ];

  const sendMessage = async (body: string): Promise<SendMessageResult> => {
    const { data, error, response } = await withResponse(
      sdk.postMessageHandler({
        client: proxyClient,
        path: { form_id: formId, answer_id: answerId },
        body: { body },
      })
    );

    const result = handleMutationResponse(response, data, error);
    if (result.success) {
      void mutate(messagesKey).catch(() => {});
      return { success: true };
    }
    return { success: false, ...(result.forbidden ? { forbidden: true } : {}) };
  };

  return { sendMessage: useSingleFlightAction(sendMessage) };
};
