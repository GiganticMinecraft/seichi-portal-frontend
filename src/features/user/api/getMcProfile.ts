import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';

import { McAccessToken, McProfile } from '../types';

const url = 'https://api.minecraftservices.com/minecraft/profile';

const responseJsonSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const getMcProfile = async (
  token: McAccessToken,
): Promise<McProfile> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: jsonHeaders.Accept,
      Authorization: `Bearer ${token.token}`,
    },
  });
  if (!response.ok)
    throw new Error(`Network Error: ${response.status} ${response.statusText}`);
  const res = responseJsonSchema.parse(response.json());

  return {
    id: res.id,
    name: res.name,
  };
};
