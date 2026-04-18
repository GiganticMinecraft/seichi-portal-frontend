'use client';

import { proxyClient } from '@/lib/proxyClient';

export const useFormLabelActions = (formId: string) => {
  const updateLabels = async (labelIds: (string | number)[]) => {
    await proxyClient.PUT('/forms/{form_id}/labels', {
      params: { path: { form_id: formId } },
      body: { labels: labelIds.map(String) },
    });
  };

  return { updateLabels };
};
