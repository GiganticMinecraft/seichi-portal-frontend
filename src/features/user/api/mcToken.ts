'use server';

import { cookies } from 'next/headers';
import type { acquireMinecraftAccessToken } from './login';
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

const KEY = 'SEICHI_PORTAL__MC_TOKEN';

export const getCachedToken = (cookie?: RequestCookies): Promise<string | undefined> => {
  return new Promise((resolve, _reject) => {
    const cache = cookie ? cookie.get(KEY) : cookies().get(KEY);

    resolve(cache?.value);
  })
};

export const saveTokenToCache = ({
  token,
  expires,
}: Awaited<ReturnType<typeof acquireMinecraftAccessToken>>) => {
  const store = cookies();

  store.set(KEY, token, {
    maxAge: expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
};

export const clearCachedToken = () => {
  const store = cookies();

  store.delete(KEY);
};
