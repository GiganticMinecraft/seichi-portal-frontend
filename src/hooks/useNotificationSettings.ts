'use client';

import { proxyClient } from '@/lib/proxyClient';
import type { ApiPaths } from '@/lib/api/types';

type NotificationSettingsUpdateBody =
  ApiPaths['/notifications/settings/me']['patch']['requestBody']['content']['application/json'];

export const useNotificationSettings = () => {
  const updateSettings = async (
    data: NotificationSettingsUpdateBody
  ): Promise<{ ok: boolean }> => {
    const { response } = await proxyClient.PATCH('/notifications/settings/me', {
      body: data,
    });
    return { ok: response.ok };
  };

  return { updateSettings };
};
