import { useState } from 'react';
import { proxyClient } from '@/lib/proxyClient';
import {
  toCreateFormBody,
  toFormLabelsUpdateBody,
  toFormUpdateBody,
  toQuestionsUpdateBody,
} from '../_lib/formRequestBuilders';
import type { Form } from '../_schema/createFormSchema';

type SubmitError = { message: string };

export const useCreateForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<SubmitError | null>(null);

  const createForm = async (data: Form) => {
    setSubmitError(null);

    let createdFormId: string;
    try {
      const { data: createdForm, response } = await proxyClient.POST('/forms', {
        body: toCreateFormBody(data),
      });
      if (!response.ok || !createdForm) {
        throw new Error();
      }
      createdFormId = createdForm.id;
    } catch {
      setSubmitError({ message: 'フォームの作成に失敗しました。' });
      return;
    }

    const { response: setFormMetadataResponse } = await proxyClient.PATCH(
      '/forms/{id}',
      {
        params: { path: { id: createdFormId } },
        body: toFormUpdateBody(data),
      }
    );
    if (!setFormMetadataResponse.ok) {
      setSubmitError({ message: 'フォームのメタデータの設定に失敗しました。' });
      return;
    }

    const { response: addQuestionResponse } = await proxyClient.PUT(
      '/forms/{id}/questions',
      {
        params: { path: { id: createdFormId } },
        body: toQuestionsUpdateBody(data),
      }
    );
    if (!addQuestionResponse.ok) {
      setSubmitError({ message: '質問の追加に失敗しました。' });
      return;
    }

    const { response: putLabelsResponse } = await proxyClient.PUT(
      '/forms/{form_id}/labels',
      {
        params: { path: { form_id: createdFormId } },
        body: toFormLabelsUpdateBody(data),
      }
    );
    if (!putLabelsResponse.ok) {
      setSubmitError({ message: 'ラベルの設定に失敗しました。' });
      return;
    }

    setIsSubmitted(true);
  };

  return { createForm, isSubmitted, submitError };
};
