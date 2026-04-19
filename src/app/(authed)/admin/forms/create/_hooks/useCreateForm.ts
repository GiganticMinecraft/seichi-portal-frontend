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
    setIsSubmitted(false);

    try {
      const { data: createdForm, response } = await proxyClient.POST('/forms', {
        body: toCreateFormBody(data),
      });
      if (!response.ok || !createdForm) {
        throw new Error('フォームの作成に失敗しました。');
      }
      const createdFormId = createdForm.id;

      const { response: setFormMetadataResponse } = await proxyClient.PATCH(
        '/forms/{id}',
        {
          params: { path: { id: createdFormId } },
          body: toFormUpdateBody(data),
        }
      );
      if (!setFormMetadataResponse.ok) {
        throw new Error('フォームのメタデータの設定に失敗しました。');
      }

      const { response: addQuestionResponse } = await proxyClient.PUT(
        '/forms/{id}/questions',
        {
          params: { path: { id: createdFormId } },
          body: toQuestionsUpdateBody(data),
        }
      );
      if (!addQuestionResponse.ok) {
        throw new Error('質問の追加に失敗しました。');
      }

      const { response: putLabelsResponse } = await proxyClient.PUT(
        '/forms/{form_id}/labels',
        {
          params: { path: { form_id: createdFormId } },
          body: toFormLabelsUpdateBody(data),
        }
      );
      if (!putLabelsResponse.ok) {
        throw new Error('ラベルの設定に失敗しました。');
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError({
        message:
          error instanceof Error
            ? error.message
            : '予期せぬエラーが発生しました。',
      });
    }
  };

  return { createForm, isSubmitted, submitError };
};
