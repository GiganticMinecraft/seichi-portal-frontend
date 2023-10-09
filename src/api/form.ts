'use server';

import {
  batchAnswersSchema,
  formSchema,
  formsSchema,
} from '@/schemas/formSchema';
import type { BatchAnswer, Form } from '@/schemas/formSchema';

export const getForms = async (token: string) => {
  const response = await fetch('http://localhost:9000/forms', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  return formsSchema.parse(await response.json());
};

export const getForm = async (formId: number, token: string): Promise<Form> => {
  const response = await fetch(`http://localhost:9000/forms/${formId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  return formSchema.parse(await response.json());
};

export const postAnswers = async (
  form_id: number,
  answers: { question_id: number; answer: string }[],
  token: string
): Promise<boolean> => {
  const answersJson = JSON.stringify({
    uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6', //todo: user側の処理を実装したら書き換える
    timestamp: new Date(),
    form_id,
    answers,
  });
  const response = await fetch(`http://localhost:9000/forms/answers`, {
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
  return await fetch(`http://localhost:9000/forms/answers`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  }).then(async (response) => batchAnswersSchema.parse(await response.json()));
};
