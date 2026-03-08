'use client';

import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Home = () => {
  const { instance, accounts, inProgress } = useMsal();
  const router = useRouter();

  useEffect(() => {
    if (inProgress !== InteractionStatus.None) return;

    (async () => {
      await fetch('/api/logout', { method: 'DELETE' });

      if (accounts[0]) {
        await instance.initialize().catch((e) => console.log(e));
        await instance.logoutRedirect({
          account: instance.getAccountByHomeId(accounts[0].homeAccountId),
          postLogoutRedirectUri: '/',
        });
      } else {
        router.push('/');
      }
    })().catch((e) => console.log(e));
  }, [accounts, instance, router, inProgress]);

  return <></>;
};

export default Home;
