'use client';

import { proxyClient } from '@/lib/proxyClient';
import type { paths } from '@/generated/api-types';

type FormUpdateBody =
  paths['/forms/{id}']['put']['requestBody']['content']['application/json'];

export const useFormEditActions = (formId: string) => {
  const updateForm = async (body: FormUpdateBody): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.PUT('/forms/{id}', {
      params: { path: { id: formId } },
      body,
    });
    return { ok: response.ok };
  };

  return { updateForm };
};
