'use client';

import { Button } from '@mui/material';
import { useMsal } from '@azure/msal-react';

const loginRequest = {
  scopes: ['XboxLive.signin offline_access'],
  redirectStartPage: '/',
};

export const SigninButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(console.error);
  };

  return (
    <Button color="inherit" onClick={handleLogin}>
      サインイン
    </Button>
  );
};
