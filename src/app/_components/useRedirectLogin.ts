'use client';

import { useMsal } from '@azure/msal-react';
import { useState } from 'react';

const DEFAULT_REDIRECT_ERROR_MESSAGE = 'サインイン画面への遷移に失敗しました。';

type UseRedirectLoginOptions = {
  errorMessage?: string;
};

const loginRequest = {
  scopes: ['XboxLive.signin offline_access'],
  redirectStartPage: '/',
};

export const useRedirectLogin = (options?: UseRedirectLoginOptions) => {
  const { instance } = useMsal();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setErrorMessage(null);
    setIsLoggingIn(true);
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error: unknown) {
      console.error(
        options?.errorMessage ?? DEFAULT_REDIRECT_ERROR_MESSAGE,
        error
      );
      setErrorMessage(options?.errorMessage ?? DEFAULT_REDIRECT_ERROR_MESSAGE);
      setIsLoggingIn(false);
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
