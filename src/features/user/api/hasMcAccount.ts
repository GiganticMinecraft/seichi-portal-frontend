import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';

import { McAccessToken } from '../types';

const url = 'https://api.minecraftservices.com/entitlements/mcstore';

const hasMcAccountResponse = z.object({
  signature: z.string(),
  keyId: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      signature: z.string(),
    }),
  ),
});

export const hasMcAccount = async (token: McAccessToken) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: jsonHeaders.Accept,
      Authorization: `Bearer ${token.token}`,
    },
  });
  if (!response.ok)
    throw new Error(`Network Error: ${response.status} ${response.statusText}`);
  // TODO: the signature should always be checked with the public key from Mojang to verify that it is a legitimate response from the official servers
  const res = hasMcAccountResponse.parse(response.json());

  return res.items.length !== 0;
};
