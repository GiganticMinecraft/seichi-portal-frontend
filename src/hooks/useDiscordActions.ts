'use client';

import * as sdk from '@/generated/api/sdk.gen';
import { handleMutationResponse } from '@/hooks/useApiMutation';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

export const useDiscordActions = () => {
  const unlinkDiscord = async (): Promise<void> => {
    const { data, error, response } = await withResponse(
      sdk.unlinkDiscord({
        client: proxyClient,
      })
    );
    handleMutationResponse(response, data, error);
  };

  return { unlinkDiscord: useSingleFlightAction(unlinkDiscord) };
};
