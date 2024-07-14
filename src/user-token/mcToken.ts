'use server';

import { cookies } from 'next/headers';
import { DEBUG_MODE } from '@/env';
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

const KEY = 'SEICHI_PORTAL__MC_TOKEN';

export const getCachedToken = (
  cookie?: RequestCookies
): Promise<string | undefined> => {
  return new Promise((resolve, _reject) => {
    const cache = cookie ? cookie.get(KEY) : cookies().get(KEY);

    if (process.env.NODE_ENV == 'development' && DEBUG_MODE && !cache) {
      resolve('debug_user');
    } else {
      resolve(cache?.value);
    }
  });
};

export const saveTokenToCache = (tokenWithExpires: {
  token: string;
  expires: number;
}) => {
  const store = cookies();

  store.set(KEY, tokenWithExpires.token, {
    maxAge: tokenWithExpires.expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
};

export const clearCachedToken = async (): Promise<void> => {
  return new Promise((resolve, _reject) => {
    const store = cookies();

    store.delete(KEY);
    resolve();
  });
};
