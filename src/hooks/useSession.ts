'use client';

import useSWR from 'swr';
import { z } from 'zod';
import { useHasHydrated } from './useHasHydrated';
import { HttpError, isHttpError } from '@/lib/httpError';
import { userInfoResponseSchema } from '@/lib/api/schemas';

const sessionResponseSchema = z.object({
  user: userInfoResponseSchema,
});

export type SessionUser = z.infer<typeof userInfoResponseSchema>;
export type SessionState =
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

const fetchSession = async (): Promise<
  z.infer<typeof sessionResponseSchema>
> => {
  const response = await fetch('/api/session', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw new HttpError({
      message: `Request failed: ${response.status}`,
      status: response.status,
      url: '/api/session',
    });
  }

  const body: unknown = await response.json().catch(() => null);
  const parsed = sessionResponseSchema.safeParse(body);

  if (!parsed.success) {
    throw new Error('Invalid session response');
  }

  return parsed.data;
};

export const useSession = () => {
  const hasHydrated = useHasHydrated();
  const { data, error, isLoading } = useSWR(
    hasHydrated ? '/api/session' : null,
    fetchSession
  );

  const state: SessionState = (() => {
    if (data) {
      return 'authenticated';
    }

    if (isHttpError(error) && error.status === 401) {
      return 'unauthenticated';
    }

    if (error) {
      return 'error';
    }

    if (!hasHydrated || isLoading) {
      return 'loading';
    }

    return 'loading';
  })();

  return {
    user: data?.user,
    error,
    state,
  };
};
