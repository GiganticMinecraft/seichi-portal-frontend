'use client';

import { useMsal } from '@azure/msal-react';
import { LoadingButton } from '@mui/lab';
import { Alert, Snackbar } from '@mui/material';
import {
  createErr,
  createOk,
  isErr,
  unwrapErr,
  unwrapOk,
} from 'option-t/esm/PlainResult';
import { useState, useTransition } from 'react';
import {
  acquireMinecraftAccessToken,
  acquireXboxLiveToken,
  acquireXboxServiceSecurityToken,
} from '../api/login';
import { saveTokenToCache } from '../api/mcToken';
import { loginRequest } from '../const/authConfig';

export const SigninButton = () => {
  const { instance } = useMsal();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | undefined>(undefined);

  const onClick = () => {
    setError(undefined);

    startTransition(async () => {
      await instance.initialize();
      const token = await instance
        .acquireTokenSilent(loginRequest)
        .catch(async () => instance.acquireTokenPopup(loginRequest))
        .then((r) => createOk(r.accessToken))
        .catch((e: Error) => createErr(e));
      if (isErr(token)) {
        setError(unwrapErr(token));
        return;
      }

      const xblToken = await acquireXboxLiveToken(unwrapOk(token));
      if (isErr(xblToken)) {
        setError(unwrapErr(xblToken));
        return;
      }
      const xstsToken = await acquireXboxServiceSecurityToken(
        unwrapOk(xblToken)
      );
      if (isErr(xstsToken)) {
        setError(unwrapErr(xstsToken));
        return;
      }
      const mcAccessToken = await acquireMinecraftAccessToken(
        unwrapOk(xstsToken)
      );
      if (isErr(mcAccessToken)) {
        setError(unwrapErr(mcAccessToken));
        return;
      }

      saveTokenToCache(unwrapOk(mcAccessToken));
    });
  };

  const handleClose = () => setError(undefined);

  // TODO: エラーメッセージの表記を分類する
  return (
    <>
      <LoadingButton color="inherit" loading={isPending} onClick={onClick}>
        サインイン
      </LoadingButton>
      <Snackbar
        open={!!error}
        autoHideDuration={10 * 1000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error">
          サインイン中にエラーが発生しました。: ${error?.message}
        </Alert>
      </Snackbar>
    </>
  );
};
