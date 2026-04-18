'use client';

import { proxyClient } from '@/lib/proxyClient';
import type { paths } from '@/generated/api-types';

type NotificationSettingsUpdateBody =
  paths['/notifications/settings/me']['patch']['requestBody']['content']['application/json'];

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
