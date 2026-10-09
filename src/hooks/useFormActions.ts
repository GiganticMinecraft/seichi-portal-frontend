'use client';

import * as sdk from '@/generated/api/sdk.gen';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

export const useFormActions = () => {
  const archiveForm = async (formId: string): Promise<{ ok: boolean }> => {
    const { data, error, response } = await withResponse(
      sdk.archiveFormHandler({
        client: proxyClient,
        path: { form_id: formId },
      })
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  const restoreForm = async (formId: string): Promise<{ ok: boolean }> => {
    const { data, error, response } = await withResponse(
      sdk.restoreArchivedFormHandler({
        client: proxyClient,
        path: { form_id: formId },
      })
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  return {
    archiveForm: useSingleFlightAction(archiveForm),
    restoreForm: useSingleFlightAction(restoreForm),
  };
};
