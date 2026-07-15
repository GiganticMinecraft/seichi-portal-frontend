'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

import { usePendingAction } from '@/hooks/usePendingAction';

import { getMsalInstance } from './MsalProvider';

export const SignoutButton = () => {
  const router = useRouter();

  const { run, pending } = usePendingAction(async () => {
    try {
      await fetch('/api/logout', { method: 'DELETE' });

      const msalInstance = getMsalInstance();
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
    }
  });

  return (
    <Button
      color="inherit"
      onClick={() => {
        void run();
      }}
      disabled={pending}
    >
      サインアウト
    </Button>
  );
};
