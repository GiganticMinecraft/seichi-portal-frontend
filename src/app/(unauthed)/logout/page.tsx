'use client';

import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Home = () => {
  const { instance, accounts, inProgress } = useMsal();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (accounts[0] && inProgress === InteractionStatus.None) {
        await instance.initialize().catch((e) => console.log(e));
        await fetch('/api/proxy/session', {
          method: 'DELETE',
        });
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
