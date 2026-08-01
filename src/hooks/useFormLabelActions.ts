'use client';

import { handleMutationResponse } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { proxyClient } from '@/lib/proxyClient';

export const useFormLabelActions = (formId: string) => {
  const updateLabels = async (labelIds: string[]): Promise<{ ok: boolean }> => {
    const { data, error, response } = await proxyClient.PUT(
      '/api/v1/forms/{form_id}',
      {
        params: { path: { form_id: formId } },
        body: { labels: labelIds },
      }
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  return { updateLabels: useSingleFlightAction(updateLabels) };
};
