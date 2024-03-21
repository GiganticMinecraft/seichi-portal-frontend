'use client';

import { useMsal } from '@azure/msal-react';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { clearCachedToken } from '../api/mcToken';

export const SignoutButton = () => {
  const { instance } = useMsal();
  const router = useRouter();

  const onClick = async () => {
    instance.logoutRedirect();
    clearCachedToken();
    router.refresh();
  };

  return (
    <Button color="inherit" onClick={onClick}>
      サインアウト
    </Button>
  );
};
