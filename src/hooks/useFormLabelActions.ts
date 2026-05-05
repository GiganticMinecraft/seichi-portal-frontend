'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';

export const useFormLabelActions = (formId: string) => {
  const updateLabels = async (labelIds: string[]): Promise<void> => {
    const { data, response } = await proxyClient.PUT(
      '/forms/{form_id}/labels',
      {
        params: { path: { form_id: formId } },
        body: { labels: labelIds },
      }
    );
    await handleMutationResponse(response, data);
  };

  return { updateLabels };
};
