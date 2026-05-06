'use client';

import { useSWRConfig } from 'swr';
import { proxyClient } from '@/lib/proxyClient';

export const useLabelCRUD = (labelType: 'answers' | 'forms') => {
  const { mutate } = useSWRConfig();
  const key = labelType === 'answers' ? ['/labels/answers'] : ['/labels/forms'];

  const createLabel = async (name: string): Promise<{ ok: boolean }> => {
    if (labelType === 'answers') {
      const { response } = await proxyClient.POST('/labels/answers', {
        body: { name },
      });
      if (response.ok) await mutate(key);
      return { ok: response.ok };
    } else {
      const { response } = await proxyClient.POST('/labels/forms', {
        body: { name },
      });
      if (response.ok) await mutate(key);
      return { ok: response.ok };
    }
  };

  const deleteLabel = async (id: string | number): Promise<{ ok: boolean }> => {
    if (labelType === 'answers') {
      const { response } = await proxyClient.DELETE(
        '/labels/answers/{label_id}',
        { params: { path: { label_id: String(id) } } }
      );
      if (response.ok) await mutate(key);
      return { ok: response.ok };
    } else {
      const { response } = await proxyClient.DELETE(
        '/labels/forms/{label_id}',
        {
          params: { path: { label_id: String(id) } },
        }
      );
      if (response.ok) await mutate(key);
      return { ok: response.ok };
    }
  };

  const editLabel = async (
    id: string | number,
    name: string
  ): Promise<{ ok: boolean }> => {
    if (labelType === 'answers') {
      const { response } = await proxyClient.PATCH(
        '/labels/answers/{label_id}',
        {
          params: { path: { label_id: String(id) } },
          body: { name },
        }
      );
      if (response.ok) await mutate(key);
      return { ok: response.ok };
    } else {
      const { response } = await proxyClient.PATCH('/labels/forms/{label_id}', {
        params: { path: { label_id: String(id) } },
        body: { name },
      });
      if (response.ok) await mutate(key);
      return { ok: response.ok };
    }
  };

  return { createLabel, deleteLabel, editLabel };
};
