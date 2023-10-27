'use client';

import { useMsal } from '@azure/msal-react';
import { Button } from '@mui/material';
import { useTransition } from 'react';
import {
  acquireMinecraftAccessToken,
  acquireXboxLiveToken,
  acquireXboxServiceSecurityToken,
} from '../api/login';
import { saveTokenToCache } from '../api/mcToken';
import { loginRequest } from '../const/authConfig';

export const SigninButton = () => {
  const { instance } = useMsal();
  const [_isPending, startTransition] = useTransition();

  const onClick = async () => {
    await instance.initialize();
    const token = await instance
      .acquireTokenSilent(loginRequest)
      .catch(async () => instance.acquireTokenPopup(loginRequest))
      .then((r) => r.accessToken);
    startTransition(async () => {
      const xblToken = await acquireXboxLiveToken(token);
      const xstsToken = await acquireXboxServiceSecurityToken(xblToken);
      const mcAccessToken = await acquireMinecraftAccessToken(xstsToken);

      saveTokenToCache(mcAccessToken);
    });
  };

  return (
    <Button color="inherit" onClick={onClick}>
      サインイン
    </Button>
  );
};
