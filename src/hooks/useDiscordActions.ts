'use client';

import { proxyClient } from '@/lib/proxyClient';
import { handleMutationResponse } from '@/hooks/useApiMutation';

export const useDiscordActions = () => {
  const unlinkDiscord = async (): Promise<void> => {
    const { data, response } = await proxyClient.DELETE('/link-discord', {});
    await handleMutationResponse(response, data);
  };

  return { unlinkDiscord };
};
