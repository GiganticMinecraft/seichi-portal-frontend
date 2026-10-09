'use client';

import * as sdk from '@/generated/api/sdk.gen';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import type { AnswerPublication, AnswerStatus } from '@/lib/api-types';
import { proxyClient } from '@/lib/proxyClient';

export const useAnswerActions = (formId: string, answerId: string) => {
  const updateTitle = async (title: string): Promise<{ ok: boolean }> => {
    const { data, error, response } = await withResponse(
      sdk.updateAnswerHandler({
        client: proxyClient,
        path: { form_id: formId, answer_id: answerId },
        body: { title },
      })
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  const updatePublication = async (
    publication: AnswerPublication
  ): Promise<{ ok: boolean }> => {
    const { data, error, response } = await withResponse(
      sdk.updateAnswerHandler({
        client: proxyClient,
        path: { form_id: formId, answer_id: answerId },
        body: { publication },
      })
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  const updateStatus = async (
    status: AnswerStatus
  ): Promise<{ ok: boolean }> => {
    const { data, error, response } = await withResponse(
      sdk.updateAnswerHandler({
        client: proxyClient,
        path: { form_id: formId, answer_id: answerId },
        body: { status },
      })
    );
    const result = handleMutationResponse(response, data, error);
    return { ok: result.success };
  };

  const updateLabels = async (labelIds: string[]): Promise<{ ok: boolean }> => {
    const { error, response } = await withResponse(
      sdk.replaceAnswerLabels({
        client: proxyClient,
        path: { answer_id: answerId },
        body: { labels: labelIds },
      })
    );
    const result = handleMutationResponse(response, undefined, error);
    return { ok: result.success };
  };

  return {
    updateTitle: useSingleFlightAction(updateTitle),
    updatePublication: useSingleFlightAction(updatePublication),
    updateStatus: useSingleFlightAction(updateStatus),
    updateLabels: useSingleFlightAction(updateLabels),
  };
};
