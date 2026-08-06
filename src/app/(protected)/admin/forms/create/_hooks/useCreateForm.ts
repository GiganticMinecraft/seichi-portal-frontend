import { useState } from 'react';

import { useSingleFlightAction } from '@/hooks/useSingleFlightAction';
import { proxyClient } from '@/lib/proxyClient';

import {
  toCreateFormBody,
  toFormUpdateBody,
} from '../../_lib/formRequestBuilders';
import type { FormEditorValues } from '../../_schema/formEditorSchema';

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitted'; formId: string }
  | { kind: 'failed'; message: string }
  | { kind: 'partiallyFailed'; formId: string; message: string };

export const useCreateForm = () => {
  const [submitState, setSubmitState] = useState<SubmitState>({
    kind: 'idle',
  });

  const createForm = async (data: FormEditorValues) => {
    setSubmitState({ kind: 'idle' });

    try {
      const { data: createdForm, response } = await proxyClient.POST(
        '/api/v1/forms',
        {
          body: toCreateFormBody(data),
        }
      );
      if (!response.ok || !createdForm) {
        setSubmitState({
          kind: 'failed',
          message: 'フォームの作成に失敗しました。',
        });
        return;
      }
      const createdFormId = createdForm.id;

      const { response: setFormMetadataResponse } = await proxyClient.PUT(
        '/api/v1/forms/{form_id}',
        {
          params: { path: { form_id: createdFormId } },
          body: toFormUpdateBody(data, false),
        }
      );
      if (!setFormMetadataResponse.ok) {
        setSubmitState({
          kind: 'partiallyFailed',
          formId: createdFormId,
          message:
            'フォーム自体は作成されましたが、公開範囲や回答受付期間などの詳細設定の保存に失敗しました。もう一度「フォーム作成」を押すと別のフォームが新規に作成されてしまうため、編集画面から設定をやり直してください。',
        });
        return;
      }

      setSubmitState({ kind: 'submitted', formId: createdFormId });
    } catch {
      setSubmitState({
        kind: 'failed',
        message: '予期せぬエラーが発生しました。',
      });
    }
  };

  return { createForm: useSingleFlightAction(createForm), submitState };
};
