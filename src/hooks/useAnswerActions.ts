'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';

export const useAnswerActions = (formId: string, answerId: string) => {
  const updateTitle = async (title: string): Promise<{ ok: boolean }> => {
    const { data, error, response } = await proxyClient.PATCH(
      '/api/v1/forms/{form_id}/answers/{answer_id}',
      {
        params: { path: { form_id: formId, answer_id: answerId } },
        body: { title },
      }
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  const updateLabels = async (labelIds: string[]): Promise<{ ok: boolean }> => {
    const { error, response } = await proxyClient.PUT(
      '/api/v1/forms/answers/{answer_id}/labels',
      {
        params: { path: { answer_id: answerId } },
        body: { labels: labelIds },
      }
    );
    const result = handleMutationResponse(response, undefined, error);
    return { ok: result.success };
  };

  return { updateTitle, updateLabels };
};
