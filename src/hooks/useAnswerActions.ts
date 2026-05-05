'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';

export const useAnswerActions = (formId: string, answerId: string) => {
  const updateTitle = async (title: string): Promise<{ ok: boolean }> => {
    const { data, response } = await proxyClient.PATCH(
      '/forms/{form_id}/answers/{answer_id}',
      {
        params: { path: { form_id: formId, answer_id: answerId } },
        body: { title },
      }
    );
    const result = await handleMutationResponse(response, data);
    return { ok: result.success };
  };

  const updateLabels = async (labelIds: string[]): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.PUT(
      '/forms/answers/{answer_id}/labels',
      {
        params: { path: { answer_id: answerId } },
        body: { labels: labelIds },
      }
    );
    const result = await handleMutationResponse(response, undefined);
    return { ok: result.success };
  };

  return { updateTitle, updateLabels };
};
