'use client';

import type { UpdateNotificationSettingsSchema } from '@/lib/api-types';

export const useNotificationSettings = () => {
  const updateSettings = async (
    data: UpdateNotificationSettingsSchema
  ): Promise<{ ok: boolean }> => {
    const response = await fetch(`/api/proxy/notifications/settings/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return { ok: response.ok };
  };

  return { updateSettings };
};
