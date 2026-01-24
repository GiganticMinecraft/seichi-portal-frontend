import { cookies } from 'next/headers';
import { DEBUG_MODE } from '@/env';
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

const KEY = 'SEICHI_PORTAL__SESSION_ID';

export const getCachedToken = async (
  cookie?: RequestCookies
): Promise<string | undefined> => {
  const cookieStore = cookie ?? (await cookies());
  const cache = cookieStore.get(KEY);

  if (process.env.NODE_ENV == 'development' && DEBUG_MODE && !cache) {
    return 'debug_user';
  } else {
    return cache?.value;
  }
};
