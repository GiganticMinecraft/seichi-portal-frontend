'use client';

import { useMsal } from '@azure/msal-react';
import { Button } from '@mui/material';
import { loginRequest } from '@/authConfig';

export const SigninButton = () => {
  const { instance } = useMsal();

  const onClick = async () => {
    await instance.initialize();
    await instance
      .acquireTokenSilent(loginRequest)
      .catch(async () => instance.acquireTokenPopup(loginRequest));
  };

  return (
    <Button color="inherit" onClick={onClick}>
      サインイン
    </Button>
  );
};
