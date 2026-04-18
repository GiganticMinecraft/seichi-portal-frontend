'use client';

import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const SignoutButton = () => {
  const { instance, accounts, inProgress } = useMsal();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    if (isSubmitting || inProgress !== InteractionStatus.None) return;

    setIsSubmitting(true);

    try {
      await fetch('/api/logout', { method: 'DELETE' });

      if (accounts[0]) {
        await instance.initialize();
        await instance.logoutRedirect({
          account: instance.getAccountByHomeId(accounts[0].homeAccountId),
          postLogoutRedirectUri: '/',
        });
        return;
      }

      router.push('/');
    } catch (e) {
      console.error('Failed to sign out:', e);
      setIsSubmitting(false);
    }
  };

  return (
    <Button color="inherit" onClick={handleClick} disabled={isSubmitting}>
      サインアウト
    </Button>
  );
};
