'use client';

import { useState } from 'react';
import { useFormEditActions } from '@/hooks/useFormEditActions';
import { toFormUpdateBody } from '../_lib/formRequestBuilders';
import type { FormEditorValues } from '../_schema/formEditorSchema';

export const useUpdateFormSubmission = (formId: string) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { updateForm } = useFormEditActions(formId);

  const submit = async (
    data: FormEditorValues
  ): Promise<{ ok: true } | { ok: false; errorMessage: string }> => {
    setIsSubmitted(false);

    const updateFormResult = await updateForm(toFormUpdateBody(data, true));
    if (!updateFormResult.ok) {
      const errorMessage = 'フォームの更新に失敗しました。';
      return { ok: false, errorMessage };
    }

    setIsSubmitted(true);
    return { ok: true };
  };

  return { submit, isSubmitted };
};
