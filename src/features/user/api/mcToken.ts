'use server';

import { cookies } from 'next/headers';
import { DEBUG_MODE } from '@/env';
import type { acquireMinecraftAccessToken } from './login';
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
