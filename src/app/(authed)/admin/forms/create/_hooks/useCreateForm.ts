import { useState } from 'react';
import { proxyClient } from '@/lib/proxyClient';
import {
  toCreateFormBody,
  toFormUpdateBody,
} from '../../_lib/formRequestBuilders';
import type { FormEditorValues } from '../../_schema/formEditorSchema';

type SubmitError = { message: string };

export const useCreateForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<SubmitError | null>(null);

  const createForm = async (data: FormEditorValues) => {
    setSubmitError(null);
    setIsSubmitted(false);

    try {
      const { data: createdForm, response } = await proxyClient.POST('/forms', {
        body: toCreateFormBody(data),
      });
      if (!response.ok || !createdForm) {
        setSubmitError({ message: 'フォームの作成に失敗しました。' });
        return;
      }
      const createdFormId = createdForm.id;

      const { response: setFormMetadataResponse } = await proxyClient.PUT(
        '/forms/{id}',
        {
          params: { path: { id: createdFormId } },
          body: toFormUpdateBody(data, false),
        }
      );
      if (!setFormMetadataResponse.ok) {
        setSubmitError({
          message: 'フォームのメタデータの設定に失敗しました。',
        });
        return;
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError({ message: '予期せぬエラーが発生しました。' });
    }
  };

  return { createForm, isSubmitted, submitError };
};
