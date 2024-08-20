'use client';

import { useMsal } from '@azure/msal-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Home = () => {
  const { instance, accounts } = useMsal();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (accounts[0]) {
        await instance.initialize().catch((e) => console.log(e));
        await instance.logoutRedirect({
          account: instance.getAccountByHomeId(accounts[0].homeAccountId),
          postLogoutRedirectUri: '/',
        });
        await fetch('/api/session', {
          method: 'DELETE',
        });
      } else {
        router.push('/');
      }
    })().catch((e) => console.log(e));
  }, [accounts, instance, router]);

  return <></>;
};

export default Home;
