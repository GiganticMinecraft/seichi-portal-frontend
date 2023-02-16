import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';

import { XboxToken } from '../types';

const url = 'https://api.minecraftservices.com/authentication/login_with_xbox';

const genBodyWithToken = (userHash: string, xstsToken: string) => ({
  identityToken: `XBL3.0 x=${userHash};${xstsToken}`,
});

const requireMcAccessTokenResponse = z.object({
  Token: z.string(),
});

export type McAccessToken = {
  token: string;
};

export const requireMcAccessToken = async (
  xstsToken: XboxToken,
): Promise<McAccessToken> => {
  const body = JSON.stringify(
    genBodyWithToken(xstsToken.userHash, xstsToken.token),
  );
  const response = await fetch(url, {
    method: 'POST',
    headers: jsonHeaders,
    body,
  });
  if (!response.ok) throw new Error('');
  const res = requireMcAccessTokenResponse.parse(response.json);

  return { token: res.Token };
};
