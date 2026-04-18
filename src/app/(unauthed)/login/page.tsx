'use client';

import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import type { SilentRequest } from '@azure/msal-browser';

const loginRequest = {
  scopes: ['XboxLive.signin offline_access'],
};

const LoginContent = () => {
  const { instance, inProgress, accounts } = useMsal();
  const [isInitialized, setState] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const handleFailure = (message: string, error: unknown) => {
    console.error(message, error);
    setErrorMessage(message);
  };

  useEffect(() => {
    (async () => {
      await instance.initialize();
      await instance.handleRedirectPromise();
      setState(true);
    })().catch((error) =>
      handleFailure('ログインの初期化に失敗しました。', error)
    );
  }, [instance]);

  useEffect(() => {
    if (errorMessage) return;

    (async () => {
      if (isInitialized && accounts.length > 0 && accounts[0]) {
        const requestWithAccount: SilentRequest = {
          account: accounts[0],
          ...loginRequest,
        };

        const callbackQuery = new URLSearchParams({
          callbackUrl: callbackUrl ?? '/',
        }).toString();

        try {
          const r = await instance.acquireTokenSilent(requestWithAccount);

          const res = await fetch('/api/minecraft-access-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: r.accessToken }),
          });

          if (!res.ok) {
            handleFailure(
              'ログインに失敗しました。時間を置いて再試行してください。',
              res.status
            );
            return;
          }

          router.push(callbackUrl ?? '/');
        } catch (e) {
          if (e instanceof InteractionRequiredAuthError) {
            await instance.loginRedirect({
              ...loginRequest,
              redirectStartPage: `/login?${callbackQuery}`,
            });
          } else {
            handleFailure(
              'ログインに失敗しました。時間を置いて再試行してください。',
              e
            );
          }
        }
      } else if (isInitialized && inProgress === InteractionStatus.None) {
        const callbackQuery = new URLSearchParams({
          callbackUrl: callbackUrl ?? '/',
        }).toString();
        instance
          .loginRedirect({
            ...loginRequest,
            redirectStartPage: `/login?${callbackQuery}`,
          })
          .catch((error) =>
            handleFailure('ログイン画面への遷移に失敗しました。', error)
          );
      }
    })().catch((error) => handleFailure('ログイン処理に失敗しました。', error));
  }, [
    inProgress,
    accounts,
    isInitialized,
    instance,
    router,
    callbackUrl,
    errorMessage,
  ]);

  if (errorMessage) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Alert severity="error">{errorMessage}</Alert>
        <Typography variant="body2">
          時間を置いて再試行するか、設定を確認してください。
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          再試行
        </Button>
      </Stack>
    );
  }

  return <></>;
};

const Home = () => {
  return (
    // useSearchParams は Suspense で囲われている必要がある
    // https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
    <Suspense fallback={<></>}>
      <LoginContent />
    </Suspense>
  );
};

export default Home;
