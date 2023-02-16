import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';

import { MsAuthResult } from '../types';

const url = 'https://api.minecraftservices.com/authentication/login_with_xbox';

const genBodyWithToken = (userHash: string, xstsToken: string) => ({
  identityToken: `XBL3.0 x=${userHash};${xstsToken}`,
});

const mcAuthJson = z.object({
  Token: z.string(),
});

export type McAuthResult = {
  token: string;
};

export const authMc = async (msAuth: MsAuthResult): Promise<McAuthResult> => {
  const body = JSON.stringify(genBodyWithToken(msAuth.userHash, msAuth.token));
  const response = await fetch(url, {
    method: 'POST',
    headers: jsonHeaders,
    body,
  });
  if (!response.ok) throw new Error('');
  const res = mcAuthJson.parse(response.json);

  return { token: res.Token };
};
