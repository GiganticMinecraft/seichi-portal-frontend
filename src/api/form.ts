import { Form, formSchema, formsSchema } from '@/schemas/formSchema';

export async function getForms(): Promise<Form[]> {
  const params = {
    offset: '0',
    limit: '4',
  };
  const query = new URLSearchParams(params);

  return await fetch(`http://localhost:9000/forms?${query}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(async (response) => {
    const formsJson = await response.json();
    return formsSchema.parse(formsJson);
  });
}

export async function getForm(formId: number): Promise<Form> {
  return await fetch(`http://localhost:9000/forms/${formId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then(async (response) => {
    const formJson = await response.json();
    return formSchema.parse(formJson);
  });
}

export async function postAnswers(
  answers: { questionId: number; answer: string }[]
): Promise<void> {
  const answersJson = JSON.stringify({
    uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6', //todo: user側の処理を実装したら書き換える
    timestamp: Date.now(),
    answers,
  });

  await fetch(`http://localhost:9000/forms/answers`, {
    method: 'POST',
    body: answersJson,
  });
}
