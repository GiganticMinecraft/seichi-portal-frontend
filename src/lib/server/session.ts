import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { AccessError } from '@/lib/accessError';
import { userInfoResponseSchema } from '@/lib/api/schemas';
import type { CurrentUser } from '@/lib/currentUser';
import { getPostLoginRedirectCookie } from '@/lib/postLoginRedirect';
import { normalizeRedirectTarget } from '@/lib/redirect';
import { getCachedToken } from '@/user-token/mcToken';

import {
  authorizationHeader,
  BackendError,
  requireBackendResponse,
  serverApiClient,
} from './backend';

type SessionUser = CurrentUser;

type AuthenticatedSession = {
  state: 'authenticated';
  token: string;
  user: SessionUser;
};

type UnauthenticatedSession = {
  state: 'unauthenticated';
};

type UnavailableSession = {
  state: 'unavailable';
  reason: 'backend_unavailable' | 'invalid_response';
  status?: number;
};

export type SessionResult =
  | AuthenticatedSession
  | UnauthenticatedSession
  | UnavailableSession;

export type AdminAccessResult =
  | { state: 'allowed'; session: AuthenticatedSession }
  | { state: 'forbidden'; session: AuthenticatedSession };

const parseUser = (body: unknown) => {
  const parsed = userInfoResponseSchema.safeParse(body);

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
};

const getSessionInternal = async (
  cookie?: RequestCookies
): Promise<SessionResult> => {
  const token = await getCachedToken(cookie);

  if (!token) {
    return { state: 'unauthenticated' };
  }

  try {
    const { data } = await requireBackendResponse(
      serverApiClient.GET('/api/v1/users/me', {
        headers: {
          Accept: 'application/json',
          ...authorizationHeader(token),
        },
      })
    );

    const user = parseUser(data);

    if (!user) {
      return {
        state: 'unavailable',
        reason: 'invalid_response',
        status: 502,
      };
    }

    return {
      state: 'authenticated',
      token,
      user,
    };
  } catch (error) {
    if (error instanceof BackendError && error.status === 401) {
      return { state: 'unauthenticated' };
    }

    if (error instanceof BackendError) {
      return {
        state: 'unavailable',
        reason: 'backend_unavailable',
        status: error.status,
      };
    }

    return {
      state: 'unavailable',
      reason: 'backend_unavailable',
      status: 503,
    };
  }
};

const getCachedSession = cache(async () => getSessionInternal());

export const getSession = async (
  cookie?: RequestCookies
): Promise<SessionResult> =>
  cookie ? getSessionInternal(cookie) : getCachedSession();

export const requireUser = async (
  cookie?: RequestCookies
): Promise<AuthenticatedSession> => {
  const session = await getSession(cookie);

  if (session.state === 'authenticated') {
    return session;
  }

  if (session.state === 'unauthenticated') {
    const requestHeaders = await headers();
    const redirectTo = normalizeRedirectTarget(
      requestHeaders.get('x-current-path') ??
        (await getPostLoginRedirectCookie(cookie))
    );
    redirect(
      redirectTo && redirectTo !== '/'
        ? `/?redirectTo=${encodeURIComponent(redirectTo)}`
        : '/'
    );
  }

  throw new AccessError({
    message: `Protected route is unavailable due to backend state${
      session.status ? ` (${session.status})` : ''
    }`,
    status: session.status ?? 503,
    code: 'SERVICE_UNAVAILABLE',
  });
};

export const getAdminAccess = async (
  cookie?: RequestCookies
): Promise<AdminAccessResult> => {
  const session = await requireUser(cookie);

  if (session.user.role !== 'ADMINISTRATOR') {
    return { state: 'forbidden', session };
  }

  return { state: 'allowed', session };
};
