'use client';

import { useMsal } from '@azure/msal-react';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { loginRequest } from '@/authConfig';
import type { AuthenticationResult } from '@azure/msal-browser';

export const SigninButton = () => {
  const { instance, accounts } = useMsal();
  const [res, setRes] = useState<AuthenticationResult | undefined>(undefined);

  useEffect(() => console.log(res, accounts), [res, accounts]);

  const onClick = async () => {
    await instance.initialize();
    await instance
      .acquireTokenSilent(loginRequest)
      .catch(async () => instance.acquireTokenPopup(loginRequest))
      .then(setRes);
  };

  return (
    <Button color="inherit" onClick={onClick}>
      {res ? res.accessToken : 'なし'}
      サインイン
    </Button>
  );
};
