'use server';

import { cookies } from 'next/headers';
import type { acquireMinecraftAccessToken } from './login';

const KEY = 'TOKEN';

export const getTokenFromCookie = () => {
  const store = cookies();

  return store.get(KEY)?.value;
};

export const saveTokenWithCookie = ({
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

export const clearTokenFromCookie = () => {
  const store = cookies();

  store.delete(KEY);
};
