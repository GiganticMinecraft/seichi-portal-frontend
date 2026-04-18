'use client';

import { proxyClient } from '@/lib/proxyClient';
import type { paths } from '@/generated/api-types';

type FormUpdateBody =
  paths['/forms/{id}']['patch']['requestBody']['content']['application/json'];
type QuestionsUpdateBody =
  paths['/forms/{id}/questions']['put']['requestBody']['content']['application/json'];

export const useFormEditActions = (formId: string) => {
  const updateFormMeta = async (
    body: FormUpdateBody
  ): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.PATCH('/forms/{id}', {
      params: { path: { id: formId } },
      body,
    });
    return { ok: response.ok };
  };

  const updateQuestions = async (
    body: QuestionsUpdateBody
  ): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.PUT('/forms/{id}/questions', {
      params: { path: { id: formId } },
      body,
    });
    return { ok: response.ok };
  };

  return { updateFormMeta, updateQuestions };
};
