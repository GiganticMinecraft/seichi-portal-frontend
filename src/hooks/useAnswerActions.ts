'use client';

import { proxyClient } from '@/lib/proxyClient';

export const useAnswerActions = (formId: string, answerId: number | string) => {
  const updateTitle = async (title: string): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.PATCH(
      '/forms/{form_id}/answers/{answer_id}',
      {
        params: { path: { form_id: formId, answer_id: String(answerId) } },
        body: { title },
      }
    );
    return { ok: response.ok };
  };

  const updateLabels = async (
    labelIds: (string | number)[]
  ): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.PUT(
      '/forms/answers/{answer_id}/labels',
      {
        params: { path: { answer_id: String(answerId) } },
        body: { labels: labelIds.map(String) },
      }
    );
    return { ok: response.ok };
  };

  return { updateTitle, updateLabels };
};
