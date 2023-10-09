'use server';

import { cookies } from 'next/headers';
import type { acquireMinecraftAccessToken } from './login';

const KEY = 'TOKEN';

export const getCachedToken = () => {
  const store = cookies();

  return store.get(KEY)?.value;
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
