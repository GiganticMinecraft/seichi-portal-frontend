'use client';

import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { normalizeRedirectTarget } from '@/lib/redirect';
import type { SilentRequest } from '@azure/msal-browser';

const loginRequest = {
  scopes: ['XboxLive.signin offline_access'],
};

const fetchPostLoginRedirect = async (): Promise<string> => {
  const redirectTo = normalizeRedirectTarget(
    new URLSearchParams(window.location.search).get('redirectTo')
  );
  if (redirectTo !== '/') return redirectTo;

  const response = await fetch('/api/post-login-redirect', { method: 'POST' });
  if (!response.ok) return '/forms';

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

  return '/forms';
};

export const LandingContent = () => {
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
    if (accounts.length === 0 || !accounts[0]) return;

    (async () => {
      setIsProcessing(true);
      const requestWithAccount: SilentRequest = {
        account: accounts[0]!,
        ...loginRequest,
      };

      try {
        const r = await instance.acquireTokenSilent(requestWithAccount);
        const res = await fetch('/api/minecraft-access-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: r.accessToken }),
        });

        if (!res.ok) {
          handleFailure(
            'ログインに失敗しました。Minecraftアカウントに紐づいたMicrosoftアカウントでサインインしてください。',
            res.status
          );
          return;
        }

        router.push(await fetchPostLoginRedirect());
      } catch (e) {
        if (e instanceof InteractionRequiredAuthError) {
          // Token requires interaction — don't auto-redirect; let the user click the button.
          setIsProcessing(false);
        } else {
          handleFailure(
            'ログインに失敗しました。時間を置いて再試行してください。',
            e
          );
        }
      }
    })().catch((error) => handleFailure('ログイン処理に失敗しました。', error));
  }, [accounts, instance, router, errorMessage]);

  const handleLogin = () => {
    instance
      .loginRedirect({
        ...loginRequest,
        redirectStartPage: '/',
      })
      .catch((error) =>
        handleFailure('サインイン画面への遷移に失敗しました。', error)
      );
  };

  if (errorMessage) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Stack spacing={2}>
          <Alert severity="error">{errorMessage}</Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            再試行
          </Button>
        </Stack>
      </Container>
    );
  }

  // MS からのコールバック処理中（accounts が埋まり、Minecraft アクセストークン交換中）
  // のときだけスピナーを表示。初回表示や戻り遷移時はランディングそのものを即出す。
  if (isProcessing) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={5} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700 }}
            gutterBottom
          >
            Seichi Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            整地鯖（GiganticMinecraft）公式のポータルサイトです。
            <br />
            フォームへの回答や各種設定をここから行えます。
          </Typography>
        </Box>

        <Divider sx={{ width: '100%' }} />

        <Box sx={{ width: '100%' }}>
          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2" component="div">
              <strong>ご利用にはMinecraftアカウントが必要です</strong>
              <br />
              整地鯖でプレイしたことのある、Minecraftアカウントに紐づいた
              Microsoftアカウントでサインインしてください。
            </Typography>
          </Alert>
          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Microsoftアカウントでサインイン
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};
