import { Form, formsSchema } from '@/schemas/formSchema';

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
