'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { msalInstance } from './MsalProvider';

export const SignoutButton = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await fetch('/api/logout', { method: 'DELETE' });

      await msalInstance.initialize();
      const [account] = msalInstance.getAllAccounts();

      if (account) {
        await msalInstance.logoutRedirect({
          account,
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
