'use client';

import {
  type AccountInfo,
  InteractionRequiredAuthError,
  type SilentRequest,
} from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

const completeLogin = async ({
  account,
  instance,
  router,
}: CompleteLoginParams) => {
  const request: SilentRequest = {
    account,
    ...loginRequest,
  };

  const tokenResponse = await instance.acquireTokenSilent(request);
  const isLinkedMinecraftAccount = await exchangeMinecraftAccessToken(
    tokenResponse.accessToken
  );

  if (!isLinkedMinecraftAccount) {
    throw new Error(LOGIN_ERROR_MESSAGE);
  }

  router.push(await fetchPostLoginRedirect());
};

export const useLandingLogin = () => {
  const { instance, accounts } = useMsal();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleFailure = (message: string, error: unknown) => {
    console.error(message, error);
    setErrorMessage(message);
    setIsProcessing(false);
  };

  // loginRedirect 直前に MSAL が sessionStorage に書く interaction.status ロックは、
  // ユーザーが MS ログイン画面でブラウザバックしたときも残り続け、次回 loginRedirect が
  // BrowserAuthError: interaction_in_progress で弾かれる原因になる。
  // URL に hash が無い（= MS からの正規リダイレクト応答ではない）場合は、安全に掃除する。
  useEffect(() => {
    if (window.location.hash.length > 1) return;
    const { clientId } = instance.getConfiguration().auth;
    window.sessionStorage.removeItem(`msal.${clientId}.interaction.status`);
  }, [instance]);

  useEffect(() => {
    if (errorMessage) return;
    const account = accounts[0];
    if (!account) return;

    (async () => {
      setIsProcessing(true);

      try {
        await completeLogin({ account, instance, router });
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          // Token requires interaction — don't auto-redirect; let the user click the button.
          setIsProcessing(false);
        } else if (
          error instanceof Error &&
          error.message === LOGIN_ERROR_MESSAGE
        ) {
          handleFailure(LOGIN_ERROR_MESSAGE, error);
        } else {
          handleFailure(RETRY_ERROR_MESSAGE, error);
        }
      }
    })().catch((error) => handleFailure(LOGIN_PROCESSING_ERROR_MESSAGE, error));
  }, [accounts, errorMessage, instance, router]);

  const handleLogin = () => {
    instance
      .loginRedirect({
        ...loginRequest,
        redirectStartPage: '/',
      })
      .catch((error) => handleFailure(LOGIN_REDIRECT_ERROR_MESSAGE, error));
  };

  return {
    errorMessage,
    isProcessing,
    handleLogin,
  };
};
