'use client';

import { proxyClient } from '@/lib/proxyClient';

export const useDiscordActions = () => {
  const unlinkDiscord = async () => {
    await proxyClient.DELETE('/link-discord', {});
  };

  return { unlinkDiscord };
};
