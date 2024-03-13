import { responseJsonOrErrorResponse } from '@/features/api/responseOrErrorResponse';
import type {
  BatchAnswer,
  Form,
  FormQuestion,
  MinimumForm,
  Visibility,
} from '../types/formSchema';
import type { ErrorResponse } from '@/features/api/responseOrErrorResponse';
import type { Either } from 'fp-ts/lib/Either';

const apiServerUrl = 'http://localhost:9000';

export async function getForms() {
  const response = await fetch('http://localhost:3000/api/forms', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const forms = (await response.json()) as MinimumForm[];

  return forms;
}

export const getForm = async (
  formId: number,
  token: string
): Promise<Either<ErrorResponse, Form>> => {
  const response = await fetch(`${apiServerUrl}/forms/${formId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  return responseJsonOrErrorResponse<Form>(response);
};

export const getFormQuestions = async (
  formId: number,
  token: string
): Promise<Either<ErrorResponse, FormQuestion[]>> => {
  const response = await fetch(`${apiServerUrl}/forms/${formId}/questions`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  return responseJsonOrErrorResponse<FormQuestion[]>(response);
};

export const postAnswers = async (
  form_id: number,
  answers: { question_id: number; answer: string }[],
  token: string
): Promise<boolean> => {
  const answersJson = JSON.stringify({
    form_id: Number(form_id),
    answers,
  });

  const response = await fetch(`${apiServerUrl}/forms/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: answersJson,
    cache: 'no-cache',
  });

  return response.ok;
};

export const getAllAnswers = async (
  token: string
): Promise<Either<ErrorResponse, BatchAnswer[]>> => {
  const response = await fetch(`${apiServerUrl}/forms/answers`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  return responseJsonOrErrorResponse<BatchAnswer[]>(response);
};

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
