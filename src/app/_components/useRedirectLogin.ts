'use client';

import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { useState } from 'react';

import { useHasHydrated } from '@/hooks/useHasHydrated';

const DEFAULT_REDIRECT_ERROR_MESSAGE = 'サインイン画面への遷移に失敗しました。';

type UseRedirectLoginOptions = {
  errorMessage?: string;
};

const loginRequest = {
  scopes: ['XboxLive.signin offline_access'],
  redirectStartPage: '/',
};

export const useRedirectLogin = (options?: UseRedirectLoginOptions) => {
  const { instance, inProgress } = useMsal();
  const hasHydrated = useHasHydrated();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // hydration 中に MSAL が進行中のリダイレクトを復元することがある。
  // 初回描画はサーバーと一致させ、hydration 完了後にだけ状態を反映する。
  const isLoggingIn = hasHydrated && inProgress !== InteractionStatus.None;

  const handleLogin = async () => {
    setErrorMessage(null);
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error: unknown) {
      console.error(
        options?.errorMessage ?? DEFAULT_REDIRECT_ERROR_MESSAGE,
        error
      );
      setErrorMessage(options?.errorMessage ?? DEFAULT_REDIRECT_ERROR_MESSAGE);
    }
  };

  return {
    errorMessage,
    isLoggingIn,
    handleLogin,
    resetError: () => {
      setErrorMessage(null);
    },
  };
};
