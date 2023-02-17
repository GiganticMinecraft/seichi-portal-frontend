import { z } from 'zod';

import { jsonHeaders } from '@/const/headers';

import { McAccessToken, XboxToken } from '../types';

const url = '/externalApi/mcToken';

const genBodyWithToken = (userHash: string, xstsToken: string) => ({
  identityToken: `XBL3.0 x=${userHash};${xstsToken}`,
});

const requireMcAccessTokenResponse = z.object({
  access_token: z.string(),
});

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
  if (!response.ok)
    throw new Error(`Network Error: ${response.status} ${response.statusText}`);
  const res = requireMcAccessTokenResponse.parse(await response.json());

  return { token: res.access_token };
};
