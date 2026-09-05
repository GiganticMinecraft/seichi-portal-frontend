import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

import { getDebugMode } from '@/env.server';

export const SESSION_COOKIE_NAME = '__Host-Http-SEICHI_PORTAL_SESSION_ID';

export const getCachedToken = async (
  cookie?: RequestCookies
): Promise<string | undefined> => {
  const cookieStore = cookie ?? (await cookies());
  const cache = cookieStore.get(SESSION_COOKIE_NAME);

  if (process.env.NODE_ENV == 'development' && getDebugMode() && !cache) {
    return 'debug_user';
  } else {
    return cache?.value;
  }
};
