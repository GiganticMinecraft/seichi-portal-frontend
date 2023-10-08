'use client';

import { useMsal } from '@azure/msal-react';
import { Button } from '@mui/material';
import { useTransition } from 'react';
import { acquireXboxLiveToken } from '@/api/login';
import { loginRequest } from '@/authConfig';

export const SigninButton = () => {
  const { instance } = useMsal();
  const [_isPending, startTransition] = useTransition();

  const onClick = async () => {
    await instance.initialize();
    const token = await instance
      .acquireTokenSilent(loginRequest)
      .catch(async () => instance.acquireTokenPopup(loginRequest))
      .then((r) => r.accessToken);
    startTransition(async () => acquireXboxLiveToken(token).then(console.log));
  };

  return (
    <Button color="inherit" onClick={onClick}>
      サインイン
    </Button>
  );
};
