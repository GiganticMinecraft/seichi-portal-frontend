'use client';

import { handleMutationResponse } from '@/hooks/useApiMutation';
import { proxyClient } from '@/lib/proxyClient';

export const useDiscordActions = () => {
  const unlinkDiscord = async (): Promise<void> => {
    const { data, error, response } = await proxyClient.DELETE(
      '/api/v1/link-discord',
      {}
    );
    handleMutationResponse(response, data, error);
  };

  return { unlinkDiscord };
};
