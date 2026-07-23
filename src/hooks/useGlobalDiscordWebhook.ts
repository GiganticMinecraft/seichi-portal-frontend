'use client';

import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { proxyClient } from '@/lib/proxyClient';

export const useGlobalDiscordWebhook = () => {
  const updateWebhook = async (
    url: string | null
  ): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.PUT(
      '/api/v1/settings/global-discord-webhook',
      { body: { url } }
    );
    return { ok: response.ok };
  };

  return { updateWebhook: useSingleFlightAction(updateWebhook) };
};
