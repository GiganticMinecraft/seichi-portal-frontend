import { formSchema, formsSchema, type Form } from '@/schemas/formSchema';

export async function getForms(): Promise<Form[]> {
  const response = await fetch('http://localhost:9000/forms', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-cache',
  });
  const formsJson = await response.json();

  return formsSchema.parse(formsJson);
}

export async function getForm(formId: number): Promise<Form> {
  const response = await fetch(`http://localhost:9000/forms/${formId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-cache',
  });
  const formJson = await response.json();

  return formSchema.parse(formJson);
}

export async function postAnswers(
  form_id: number,
  answers: { question_id: number; answer: string }[]
): Promise<boolean> {
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
    },
    body: answersJson,
    cache: 'no-cache',
  });

  return response.ok;
}

export async function getAnswers(): Promise<undefined> {
  return undefined;
}
