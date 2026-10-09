'use client';

import { useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';

import * as sdk from '@/generated/api/sdk.gen';
import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { withResponse } from '@/lib/api/createApiClient';
import { proxyClient } from '@/lib/proxyClient';

export const useLabelCRUD = (labelType: 'answers' | 'forms') => {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const key =
    labelType === 'answers'
      ? ['/api/v1/labels/answers']
      : ['/api/v1/labels/forms'];

  const createLabel = async (name: string): Promise<{ ok: boolean }> => {
    if (labelType === 'answers') {
      const { response } = await withResponse(
        sdk.createLabelForAnswers({
          client: proxyClient,
          body: { name },
        })
      );
      if (response.ok) {
        await mutate(key);
        router.refresh();
      }
      return { ok: response.ok };
    } else {
      const { response } = await withResponse(
        sdk.createLabelForForms({
          client: proxyClient,
          body: { name },
        })
      );
      if (response.ok) {
        await mutate(key);
        router.refresh();
      }
      return { ok: response.ok };
    }
  };

  const deleteLabel = async (id: string | number): Promise<{ ok: boolean }> => {
    if (labelType === 'answers') {
      const { response } = await withResponse(
        sdk.deleteLabelForAnswers({
          client: proxyClient,
          path: { label_id: String(id) },
        })
      );
      if (response.ok) {
        await mutate(key);
        router.refresh();
      }
      return { ok: response.ok };
    } else {
      const { response } = await withResponse(
        sdk.deleteLabelForForms({
          client: proxyClient,
          path: { label_id: String(id) },
        })
      );
      if (response.ok) {
        await mutate(key);
        router.refresh();
      }
      return { ok: response.ok };
    }
  };

  const editLabel = async (
    id: string | number,
    name: string
  ): Promise<{ ok: boolean }> => {
    if (labelType === 'answers') {
      const { response } = await withResponse(
        sdk.editLabelForAnswers({
          client: proxyClient,
          path: { label_id: String(id) },
          body: { name },
        })
      );
      if (response.ok) {
        await mutate(key);
        router.refresh();
      }
      return { ok: response.ok };
    } else {
      const { response } = await withResponse(
        sdk.editLabelForForms({
          client: proxyClient,
          path: { label_id: String(id) },
          body: { name },
        })
      );
      if (response.ok) {
        await mutate(key);
        router.refresh();
      }
      return { ok: response.ok };
    }
  };

  return {
    createLabel: useSingleFlightAction(createLabel),
    deleteLabel: useSingleFlightAction(deleteLabel),
    editLabel: useSingleFlightAction(editLabel),
  };
};
