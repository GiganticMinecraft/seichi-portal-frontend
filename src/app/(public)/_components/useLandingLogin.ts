'use client';

import {
  type AccountInfo,
  InteractionRequiredAuthError,
  type SilentRequest,
} from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useRedirectLogin } from '@/app/_components/useRedirectLogin';
import { getRetryAfterSeconds } from '@/lib/httpError';
import { normalizeRedirectTarget } from '@/lib/redirect';

const LOGIN_ERROR_MESSAGE =
  'サインインに失敗しました。Minecraftアカウントに紐づいたMicrosoftアカウントでサインインしてください。';
const BACKEND_UNREACHABLE_ERROR_MESSAGE =
  'サーバーとの通信に失敗しました。しばらく時間を置いて再試行してください。';
const RETRY_ERROR_MESSAGE =
  'サインインに失敗しました。時間を置いて再試行してください。';
const RATE_LIMIT_ERROR_MESSAGE = (retryAfter?: number) =>
  retryAfter === undefined
    ? 'サインイン試行が集中しています。時間を置いて再試行してください。'
    : `サインイン試行が集中しています。${retryAfter}秒後に再試行してください。`;
const LOGIN_PROCESSING_ERROR_MESSAGE = 'サインイン処理に失敗しました。';
const LOGIN_REDIRECT_ERROR_MESSAGE = 'サインイン画面への遷移に失敗しました。';
const loginRequest = {
  scopes: ['XboxLive.signin offline_access'],
};

const fetchPostLoginRedirect = async (): Promise<string> => {
  const redirectTo = normalizeRedirectTarget(
    new URLSearchParams(window.location.search).get('redirectTo')
  );
  if (redirectTo !== '/') return redirectTo;

  const response = await fetch('/api/post-login-redirect', { method: 'POST' });
  if (!response.ok) return '/';

  const body: unknown = await response.json().catch(() => null);
  if (
    typeof body === 'object' &&
    body !== null &&
    'redirectTo' in body &&
    typeof body.redirectTo === 'string' &&
    body.redirectTo !== '/'
  ) {
    return body.redirectTo;
  }

  return '/';
};

type LoginFailureReason =
  'invalid_account' | 'backend_unreachable' | 'rate_limited';

const exchangeMinecraftAccessToken = async (
  accessToken: string
): Promise<
  { ok: true } | { ok: false; reason: LoginFailureReason; retryAfter?: number }
> => {
  const response = await fetch('/api/minecraft-access-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: accessToken }),
  });

  if (response.ok) return { ok: true };

  const body: unknown = await response.json().catch(() => null);
  const reason = getLoginFailureReason(response.status, body);

  const retryAfter = getRetryAfterSeconds(response.headers);
  const retryMetadata =
    reason === 'rate_limited' && retryAfter !== undefined ? { retryAfter } : {};
  return {
    ok: false,
    reason,
    ...retryMetadata,
  };
};

const getLoginFailureReason = (
  status: number,
  body: unknown
): LoginFailureReason => {
  if (status === 429) return 'rate_limited';
  if (typeof body === 'object' && body !== null && 'code' in body) {
    return Reflect.get(body, 'code') === 'backend_unreachable'
      ? 'backend_unreachable'
      : 'invalid_account';
  }
  return 'invalid_account';
};

type CompleteLoginParams = {
  account: AccountInfo;
  instance: ReturnType<typeof useMsal>['instance'];
  router: ReturnType<typeof useRouter>;
};

type CompleteLoginResult =
  | { success: true }
  | { success: false; reason: LoginFailureReason; retryAfter?: number };

const completeLogin = async ({
  account,
  instance,
  router,
}: CompleteLoginParams): Promise<CompleteLoginResult> => {
  const request: SilentRequest = {
    account,
    ...loginRequest,
  };

  const tokenResponse = await instance.acquireTokenSilent(request);
  const exchangeResult = await exchangeMinecraftAccessToken(
    tokenResponse.accessToken
  );

  if (!exchangeResult.ok) {
    return {
      success: false,
      reason: exchangeResult.reason,
      ...(exchangeResult.retryAfter !== undefined
        ? { retryAfter: exchangeResult.retryAfter }
        : {}),
    };
  }

  router.push(await fetchPostLoginRedirect());
  return { success: true };
};

export const useLandingLogin = () => {
  const { instance, accounts } = useMsal();
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    errorMessage: redirectErrorMessage,
    isLoggingIn,
    handleLogin,
    resetError,
  } = useRedirectLogin({
    errorMessage: LOGIN_REDIRECT_ERROR_MESSAGE,
  });
  const [processingErrorMessage, setProcessingErrorMessage] = useState<
    string | null
  >(null);
  const router = useRouter();
  const errorMessage = processingErrorMessage ?? redirectErrorMessage;

  const handleFailure = (message: string, error: unknown) => {
    console.error(message, error);
    setProcessingErrorMessage(message);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (errorMessage || isLoggingIn) return;
    const account = accounts[0];
    if (!account) return;

    (async () => {
      setIsProcessing(true);

      try {
        const result = await completeLogin({ account, instance, router });
        if (!result.success) {
          const failureMessage = (() => {
            switch (result.reason) {
              case 'backend_unreachable':
                return BACKEND_UNREACHABLE_ERROR_MESSAGE;
              case 'rate_limited':
                return RATE_LIMIT_ERROR_MESSAGE(result.retryAfter);
              case 'invalid_account':
                return LOGIN_ERROR_MESSAGE;
            }
          })();
          setProcessingErrorMessage(failureMessage);
          setIsProcessing(false);
        }
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          // Token requires interaction — don't auto-redirect; let the user click the button.
          setIsProcessing(false);
        } else {
          handleFailure(RETRY_ERROR_MESSAGE, error);
        }
      }
    })().catch((error: unknown) => {
      handleFailure(LOGIN_PROCESSING_ERROR_MESSAGE, error);
    });
  }, [accounts, errorMessage, isLoggingIn, instance, router]);

  return {
    errorMessage,
    isProcessing,
    isLoggingIn,
    handleLogin: () => {
      resetError();
      setProcessingErrorMessage(null);
      void handleLogin();
    },
  };
};
