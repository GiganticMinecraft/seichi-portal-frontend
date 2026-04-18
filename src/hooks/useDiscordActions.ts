'use client';

export const useDiscordActions = () => {
  const unlinkDiscord = async () => {
    await fetch('/api/proxy/link-discord', {
      method: 'DELETE',
    });
  };

  return { unlinkDiscord };
};
