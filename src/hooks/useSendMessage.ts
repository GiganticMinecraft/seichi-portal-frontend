'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';

type SendMessageResult = { success: boolean; forbidden?: boolean };

export const useSendMessage = (formId: string, answerId: string) => {
  const sendMessage = async (body: string): Promise<SendMessageResult> => {
    const { data, error, response } = await proxyClient.POST(
      '/api/v1/forms/{form_id}/answers/{answer_id}/messages',
      {
        params: { path: { form_id: formId, answer_id: answerId } },
        body: { body },
      }
    );

    const result = handleMutationResponse(response, data, error);
    if (result.success) {
      return { success: true };
    }
    return { success: false, ...(result.forbidden ? { forbidden: true } : {}) };
  };

  return { sendMessage };
};
