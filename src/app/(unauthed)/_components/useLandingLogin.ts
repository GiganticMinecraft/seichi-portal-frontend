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
import { normalizeRedirectTarget } from '@/lib/redirect';

const LOGIN_ERROR_MESSAGE =
  'ログインに失敗しました。Minecraftアカウントに紐づいたMicrosoftアカウントでサインインしてください。';
const RETRY_ERROR_MESSAGE =
  'ログインに失敗しました。時間を置いて再試行してください。';
const LOGIN_PROCESSING_ERROR_MESSAGE = 'ログイン処理に失敗しました。';
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

const exchangeMinecraftAccessToken = async (accessToken: string) => {
  const response = await fetch('/api/minecraft-access-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: accessToken }),
  });

  return response.ok;
};

type CompleteLoginParams = {
  account: AccountInfo;
  instance: ReturnType<typeof useMsal>['instance'];
  router: ReturnType<typeof useRouter>;
};

type CompleteLoginResult = { success: true } | { success: false };

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
  const isLinkedMinecraftAccount = await exchangeMinecraftAccessToken(
    tokenResponse.accessToken
  );

  if (!isLinkedMinecraftAccount) {
    return { success: false };
  }

  router.push(await fetchPostLoginRedirect());
  return { success: true };
};

export const useLandingLogin = () => {
  const { instance, accounts } = useMsal();
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    errorMessage: redirectErrorMessage,
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
    if (errorMessage) return;
    const account = accounts[0];
    if (!account) return;

    (async () => {
      setIsProcessing(true);

      try {
        const result = await completeLogin({ account, instance, router });
        if (!result.success) {
          setProcessingErrorMessage(LOGIN_ERROR_MESSAGE);
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
    })().catch((error) => handleFailure(LOGIN_PROCESSING_ERROR_MESSAGE, error));
  }, [accounts, errorMessage, instance, router]);

  return {
    errorMessage,
    isProcessing,
    handleLogin: () => {
      resetError();
      setProcessingErrorMessage(null);
      handleLogin();
    },
  };
};
