'use client';

type FormMetaBody = {
  title: string;
  description: string;
  has_response_period: boolean;
  response_period: {
    start_at: string | undefined;
    end_at: string | undefined;
  };
  webhook_url: string | null;
  default_answer_title: string | null;
  visibility: string;
  answer_visibility: string;
};

type Question = {
  id: number | null;
  title: string;
  form_id: string;
  description: string;
  question_type: string;
  choices: string[];
  is_required: boolean;
};

export const useFormEditActions = (formId: string) => {
  const updateFormMeta = async (
    body: FormMetaBody
  ): Promise<{ ok: boolean }> => {
    const response = await fetch(`/api/proxy/forms/${formId}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-cache',
    });
    return { ok: response.ok };
  };

  const updateQuestions = async (
    questions: Question[]
  ): Promise<{ ok: boolean }> => {
    const response = await fetch(`/api/proxy/forms/questions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form_id: formId, questions }),
      cache: 'no-cache',
    });
    return { ok: response.ok };
  };

  return { updateFormMeta, updateQuestions };
};
