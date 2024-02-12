'use server';

import { left, map, right } from '@/generic/Types';
import {
  batchAnswersSchema,
  formSchema,
  mimimumFormsSchema,
  questionsSchema,
} from '../types/formSchema';
import type {
  BatchAnswer,
  Form,
  FormQuestion,
  Visibility,
} from '../types/formSchema';

const apiServerUrl = 'http://localhost:9000';

export const getForms = async (token: string) => {
  const response = await fetch(`${apiServerUrl}/forms`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  return mimimumFormsSchema.parse(await response.json());
};

export const getForm = async (formId: number, token: string): Promise<Form> => {
  const response = await fetch(`${apiServerUrl}/forms/${formId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  return formSchema.parse(await response.json());
};

export const getFormQuestions = async (
  formId: number,
  token: string
): Promise<FormQuestion[]> => {
  const response = await fetch(`${apiServerUrl}/forms/${formId}/questions`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  return questionsSchema.parse(await response.json());
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

export const getAllAnswers = async (token: string): Promise<BatchAnswer[]> => {
  const response = await fetch(`${apiServerUrl}/forms/answers`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  return batchAnswersSchema.parse(await response.json());
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
  formDescription: string,
  questions: Questions[],
  responsePeriod: { startAt: string; endAt: string } | undefined,
  visibility: Visibility
) => {
  const titleAndDescription = JSON.stringify({
    title: formTitle,
    description: formDescription,
  });

  type CreateFormResponse = {
    id: number;
  };

  return await fetch(`${apiServerUrl}/forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: titleAndDescription,
    cache: 'no-cache',
  })
    .then(async (response) => {
      if (!response.ok) {
        // TODO: 異常系処理を書く
        return left(new Error(''));
      }

      return right((await response.json()) as CreateFormResponse);
    })
    .then((errorWithResponse) =>
      map(errorWithResponse, (response) => response.id)
    )
    .then((errorWithCreatedFormId) =>
      map(errorWithCreatedFormId, async (formId) => {
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

        const responseAndCreatedFormId: [Response, number] = [
          await fetch(`${apiServerUrl}/forms/questions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body,
            cache: 'no-cache',
          }),
          formId,
        ];

        return responseAndCreatedFormId;
      })
    )
    .then((errorWithResponseAndCreatedFormId) =>
      map(errorWithResponseAndCreatedFormId, (responseAndCreatedFormId) =>
        responseAndCreatedFormId.then(async ([response, createdFormId]) => {
          if (!response.ok) {
            // TODO: 異常系処理を書く
          }

          if (responsePeriod == undefined) {
            // TODO: 回答可能期間を指定しなかったときの処理を書く
          }

          return await fetch(
            `${apiServerUrl}/forms/${createdFormId}?start_at=${encodeURIComponent(
              `${responsePeriod?.startAt}:00+09:00`
            )}&end_at=${encodeURIComponent(
              `${responsePeriod?.endAt}:00+09:00`
            )}&visibility=${encodeURIComponent(visibility)}`,
            {
              method: 'PATCH',
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              },
              cache: 'no-cache',
            }
          );
        })
      )
    );
};
