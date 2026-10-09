'use client';

import * as sdk from '@/generated/api/sdk.gen';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

export const useFormLabelActions = (formId: string) => {
  const updateLabels = async (labelIds: string[]): Promise<{ ok: boolean }> => {
    const { data, error, response } = await withResponse(
      sdk.updateFormHandler({
        client: proxyClient,
        path: { form_id: formId },
        body: { labels: labelIds },
      })
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  return { updateLabels: useSingleFlightAction(updateLabels) };
};
