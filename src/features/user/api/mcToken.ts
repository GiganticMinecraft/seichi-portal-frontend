'use server';

import { cookies } from 'next/headers';
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

const KEY = 'SEICHI_PORTAL__MC_TOKEN';

export const getCachedToken = (cookie?: RequestCookies) => {
  const cache = cookie ? cookie.get(KEY) : cookies().get(KEY);

  return cache?.value;
};

export const saveTokenToCache = ({
  token,
  expires,
}: {
  token: string;
  expires: number;
}) => {
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
