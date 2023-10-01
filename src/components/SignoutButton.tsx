'use client';

import { useMsal } from '@azure/msal-react';
import { Button } from '@mui/material';

export const SignoutButton = () => {
  const { instance } = useMsal();

  const onClick = async () => {
    await instance.logoutPopup();
  };

  return (
    <Button color="inherit" onClick={onClick}>
      サインアウト
    </Button>
  );
};
