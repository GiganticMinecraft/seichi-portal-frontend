'use client';

import { useSWRConfig } from 'swr';

import * as sdk from '@/generated/api/sdk.gen';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

type RelatedAnswerActionResult = { ok: boolean; forbidden?: boolean };

export const useRelatedAnswerActions = (formId: string, answerId: string) => {
  const { mutate } = useSWRConfig();
  const relatedAnswersKey = [
    '/api/v1/forms/{form_id}/answers/{answer_id}/related-answers',
    { path: { form_id: formId, answer_id: answerId } },
  ];

  const addRelatedAnswer = async (
    targetFormId: string,
    targetAnswerId: string
  ): Promise<RelatedAnswerActionResult> => {
    const { data, error, response } = await withResponse(
      sdk.addRelatedAnswerHandler({
        client: proxyClient,
        path: { form_id: formId, answer_id: answerId },
        body: { form_id: targetFormId, answer_id: targetAnswerId },
      })
    );
    const result = handleMutationResponse(response, data, error);
    if (result.success) {
      void mutate(relatedAnswersKey).catch(() => {});
      return { ok: true };
    }

    return { ok: false, ...(result.forbidden ? { forbidden: true } : {}) };
  };

  const removeRelatedAnswer = async (
    relatedAnswerId: string
  ): Promise<RelatedAnswerActionResult> => {
    const { data, error, response } = await withResponse(
      sdk.removeRelatedAnswerHandler({
        client: proxyClient,
        path: {
          form_id: formId,
          answer_id: answerId,
          related_answer_id: relatedAnswerId,
        },
      })
    );
    const result = handleMutationResponse(response, data, error);
    if (result.success) {
      void mutate(relatedAnswersKey).catch(() => {});
      return { ok: true };
    }

    return { ok: false, ...(result.forbidden ? { forbidden: true } : {}) };
  };

  return {
    addRelatedAnswer: useSingleFlightAction(addRelatedAnswer),
    removeRelatedAnswer: useSingleFlightAction(removeRelatedAnswer),
  };
};
