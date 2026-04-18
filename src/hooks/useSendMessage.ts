'use client';

import { proxyClient } from '@/lib/proxyClient';

export const useSendMessage = (formId: string, answerId: number) => {
  const sendMessage = async (body: string): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.POST(
      '/forms/{form_id}/answers/{answer_id}/messages',
      {
        params: { path: { form_id: formId, answer_id: String(answerId) } },
        body: { body },
      }
    );
    return { ok: response.ok };
  };

  return { sendMessage };
};
