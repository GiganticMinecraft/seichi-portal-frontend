'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';

export const useSendMessage = (formId: string, answerId: string) => {
  const sendMessage = async (body: string): Promise<{ ok: boolean }> => {
    const { data, error, response } = await proxyClient.POST(
      '/forms/{form_id}/answers/{answer_id}/messages',
      {
        params: { path: { form_id: formId, answer_id: answerId } },
        body: { body },
      }
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  return { sendMessage };
};
