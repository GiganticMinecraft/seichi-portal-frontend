'use client';

import { useSWRConfig } from 'swr';
import { proxyClient } from '@/lib/proxyClient';

export const useLabelCRUD = (labelType: 'answers' | 'forms') => {
  const { mutate } = useSWRConfig();
  const key =
    labelType === 'answers'
      ? ['/api/v1/labels/answers']
      : ['/api/v1/labels/forms'];

  const createLabel = async (name: string): Promise<{ ok: boolean }> => {
    if (labelType === 'answers') {
      const { response } = await proxyClient.POST('/api/v1/labels/answers', {
        body: { name },
      });
      if (response.ok) await mutate(key);
      return { ok: response.ok };
    } else {
      const { response } = await proxyClient.POST('/api/v1/labels/forms', {
        body: { name },
      });
      if (response.ok) await mutate(key);
      return { ok: response.ok };
    }
  };

  const deleteLabel = async (id: string | number): Promise<{ ok: boolean }> => {
    if (labelType === 'answers') {
      const { response } = await proxyClient.DELETE(
        '/api/v1/labels/answers/{label_id}',
        { params: { path: { label_id: String(id) } } }
      );
      if (response.ok) await mutate(key);
      return { ok: response.ok };
    } else {
      const { response } = await proxyClient.DELETE(
        '/api/v1/labels/forms/{label_id}',
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
        '/api/v1/labels/answers/{label_id}',
        {
          params: { path: { label_id: String(id) } },
          body: { name },
        }
      );
      if (response.ok) await mutate(key);
      return { ok: response.ok };
    } else {
      const { response } = await proxyClient.PATCH(
        '/api/v1/labels/forms/{label_id}',
        {
          params: { path: { label_id: String(id) } },
          body: { name },
        }
      );
      if (response.ok) await mutate(key);
      return { ok: response.ok };
    }
  };

  return { createLabel, deleteLabel, editLabel };
};
