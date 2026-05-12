'use client';

import { useState } from 'react';
import { useFormEditActions } from '@/hooks/useFormEditActions';
import { useFormLabelActions } from '@/hooks/useFormLabelActions';
import { toFormUpdateBody } from '../_lib/formRequestBuilders';
import type { FormEditorValues } from '../_schema/formEditorSchema';

export const useUpdateFormSubmission = (formId: string) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { updateForm } = useFormEditActions(formId);
  const { updateLabels } = useFormLabelActions(formId);

  const submit = async (
    data: FormEditorValues
  ): Promise<{ ok: true } | { ok: false; errorMessage: string }> => {
    setIsSubmitted(false);
    setSubmitError(null);

    const updateFormResult = await updateForm(toFormUpdateBody(data, true));
    if (!updateFormResult.ok) {
      const errorMessage = 'フォームの更新に失敗しました。';
      setSubmitError(errorMessage);
      return { ok: false, errorMessage };
    }

    const updateLabelsResult = await updateLabels(
      data.labels.map((label) => label.id)
    );
    if (!updateLabelsResult.ok) {
      const errorMessage = 'フォームラベルの更新に失敗しました。';
      setSubmitError(errorMessage);
      return { ok: false, errorMessage };
    }

    setIsSubmitted(true);
    return { ok: true };
  };

  return { submit, isSubmitted, submitError };
};
