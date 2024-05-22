'use client';

import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { clearCachedToken } from '@/user-token/mcToken';

const Home = () => {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    (async () => {
      if (accounts[0]) {
        await instance.initialize().catch((e) => console.log(e));
        clearCachedToken();
        await instance.logoutRedirect({
          account: instance.getAccountByHomeId(accounts[0].homeAccountId),
          postLogoutRedirectUri: '/',
        });
      }
    })().catch((e) => console.log(e));
  }, [accounts, instance]);

  return <></>;
};

export default Home;
