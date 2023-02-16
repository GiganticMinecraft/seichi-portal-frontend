import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';

const url = 'https://api.minecraftservices.com/entitlements/mcstore';

const responseJsonSchema = z.object({
  signature: z.string(),
  keyId: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      signature: z.string(),
    }),
  ),
});

export const hasMc = async (token: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: jsonHeaders.Accept, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('');
  // TODO: the signature should always be checked with the public key from Mojang to verify that it is a legitimate response from the official servers
  const res = responseJsonSchema.parse(response.json());

  return res.items.length !== 0;
};
