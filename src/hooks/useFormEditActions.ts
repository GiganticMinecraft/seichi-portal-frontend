'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import { schemas } from '@/generated/api-client';
import type { paths } from '@/generated/api-types';

type FormUpdateBody =
  paths['/forms/{id}']['put']['requestBody']['content']['application/json'];

export const useFormEditActions = (formId: string) => {
  const updateForm = async (body: FormUpdateBody): Promise<{ ok: boolean }> => {
    const { data, response } = await proxyClient.PUT('/forms/{id}', {
      params: { path: { id: formId } },
      body,
    });
    const result = await handleMutationResponse(
      response,
      data,
      schemas.FormSchema
    );
    return { ok: result.success };
  };

  return { updateForm };
};
