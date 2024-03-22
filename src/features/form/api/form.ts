import { responseJsonOrErrorResponse } from '@/features/api/responseOrErrorResponse';
import type { Visibility } from '../types/formSchema';
const apiServerUrl = 'http://localhost:9000';

interface Choice {
  choice: string;
}

interface Questions {
  questionTitle: string;
  questionDescription: string;
  answerType: string;
  choices: Choice[];
  isRequired: boolean;
}

export const createForm = async (
  token: string,
  formTitle: string,
  formDescription: string
) => {
  const titleAndDescription = JSON.stringify({
    title: formTitle,
    description: formDescription,
  });

  const createFormResponse = await fetch(`${apiServerUrl}/forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: titleAndDescription,
    cache: 'no-cache',
  });

  type CreateFormResponse = {
    id: number;
  };

  return responseJsonOrErrorResponse<CreateFormResponse>(createFormResponse);
};

export const addQuestions = async (
  token: string,
  formId: number,
  questions: Questions[]
) => {
  const body = JSON.stringify({
    form_id: formId,
    questions: questions.map((question) => {
      return {
        title: question.questionTitle,
        description: question.questionDescription,
        question_type: question.answerType,
        choices: question.choices
          .filter((choice) => choice.choice != '')
          .map((choice) => choice.choice),
        is_required: question.isRequired,
      };
    }),
  });

  const addQuestionsResponse = await fetch(`${apiServerUrl}/forms/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
    cache: 'no-cache',
  });

  type AddQuestionsResponse = {
    id: number;
  };

  return responseJsonOrErrorResponse<AddQuestionsResponse>(
    addQuestionsResponse
  );
};

export const updateFormMetaData = async (
  token: string,
  form_id: number,
  responsePeriod: { startAt: string; endAt: string } | undefined,
  visibility?: Visibility
) => {
  const responsePeriodParameter =
    responsePeriod != undefined
      ? `start_at=${encodeURIComponent(
          `${responsePeriod?.startAt}:00+09:00`
        )}&end_at=${encodeURIComponent(`${responsePeriod?.endAt}:00+09:00`)}`
      : '';

  const visibilityParameter =
    visibility != undefined
      ? `visibility=${encodeURIComponent(visibility)}`
      : '';

  const updateFormMetaDataResponse = await fetch(
    `${apiServerUrl}/forms/${form_id}?${responsePeriodParameter}&${visibilityParameter}`,
    {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    }
  );

  return responseJsonOrErrorResponse(updateFormMetaDataResponse);
};
