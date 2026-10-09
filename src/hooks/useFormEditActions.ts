'use client';

import * as sdk from '@/generated/api/sdk.gen';
import type * as Api from '@/generated/api/types.gen';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

type FormUpdateBody = NonNullable<Api.UpdateFormHandlerData['body']>;

export const useFormEditActions = (formId: string) => {
  const updateForm = async (body: FormUpdateBody): Promise<{ ok: boolean }> => {
    const { data, error, response } = await withResponse(
      sdk.updateFormHandler({
        client: proxyClient,
        path: { form_id: formId },
        body,
      })
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  return { updateForm: useSingleFlightAction(updateForm) };
};
