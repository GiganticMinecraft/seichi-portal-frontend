'use client';

import * as sdk from '@/generated/api/sdk.gen';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

export const useGlobalDiscordWebhook = () => {
  const updateWebhook = async (
    url: string | null
  ): Promise<{ ok: boolean }> => {
    const { response } = await withResponse(
      sdk.updateGlobalDiscordWebhook({
        client: proxyClient,
        body: { url },
      })
    );
    return { ok: response.ok };
  };

  return { updateWebhook: useSingleFlightAction(updateWebhook) };
};
