import { useState } from 'react';
import { proxyClient } from '@/lib/proxyClient';
import {
  toCreateFormBody,
  toFormUpdateBody,
} from '../../_lib/formRequestBuilders';
import type { FormEditorValues } from '../../_schema/formEditorSchema';

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitted'; formId: string }
  | { kind: 'failed'; message: string };

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
        '/api/v1/forms/{id}',
        {
          params: { path: { id: createdFormId } },
          body: toFormUpdateBody(data, false),
        }
      );
      if (!setFormMetadataResponse.ok) {
        setSubmitState({
          kind: 'failed',
          message: 'フォームのメタデータの設定に失敗しました。',
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

  return { createForm, submitState };
};
