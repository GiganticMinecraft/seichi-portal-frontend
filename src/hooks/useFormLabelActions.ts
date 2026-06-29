'use client';

import { handleMutationResponse } from '@/hooks/useApiMutation';
import { proxyClient } from '@/lib/proxyClient';

export const useFormLabelActions = (formId: string) => {
  const updateLabels = async (labelIds: string[]): Promise<{ ok: boolean }> => {
    const { data, error, response } = await proxyClient.PUT(
      '/api/v1/forms/{id}',
      {
        params: { path: { id: formId } },
        body: { labels: labelIds },
      }
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  return { updateLabels };
};
