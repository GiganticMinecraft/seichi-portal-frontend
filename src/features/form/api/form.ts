'use server';

import {
  andThenAsyncForResult,
  andThenForResult,
  createErr,
  createOk,
} from 'option-t/esm/PlainResult';
import { okOrForUndefinable } from 'option-t/esm/Undefinable/okOr';
import {
  batchAnswersSchema,
  formsSchema,
  questionsSchema,
} from '../types/formSchema';

export const getForms = async (token: string) => {
  const response = await fetch('http://localhost:9000/forms', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  })
    .then((r) =>
      r.ok ? createOk(r) : createErr(new Error(`${r.status}: ${r.statusText}`))
    )
    .catch((e: Error) => createErr(e));

  return andThenAsyncForResult(response, async (r) => {
    const result = formsSchema.safeParse(await r.json());

    return result.success ? createOk(result.data) : createErr(result.error);
  });
};

export const getForm = async (formId: number, token: string) =>
  andThenForResult(await getForms(token), (forms) =>
    okOrForUndefinable(
      forms.find((f) => f.id == formId),
      new Error('not found')
    )
  );

export const getQuestions = async (formId: number, token: string) => {
  const response = await fetch(
    `http://localhost:9000/forms/${formId}/questions`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    }
  )
    .then((r) =>
      r.ok ? createOk(r) : createErr(new Error(`${r.status}: ${r.statusText}`))
    )
    .catch((e: Error) => createErr(e));

  return andThenAsyncForResult(response, async (r) => {
    const result = questionsSchema.safeParse(await r.json());

    return result.success ? createOk(result.data) : createErr(result.error);
  });
};

export const postAnswers = async (
  form_id: number,
  answers: { question_id: number; answer: string }[],
  token: string
) => {
  const answersJson = JSON.stringify({
    form_id,
    answers,
  });
  return fetch(`http://localhost:9000/forms/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: answersJson,
    cache: 'no-cache',
  })
    .then((r) =>
      r.ok ? createOk(r) : createErr(new Error(`${r.status}: ${r.statusText}`))
    )
    .catch((e: Error) => createErr(e));
};

export const getAllAnswers = async (token: string) => {
  const response = await fetch(`http://localhost:9000/forms/answers`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  return batchAnswersSchema.parse(await response.json());
};
