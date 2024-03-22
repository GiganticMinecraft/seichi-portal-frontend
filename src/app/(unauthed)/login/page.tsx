'use client';

import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  acquireMinecraftAccessToken,
  acquireXboxLiveToken,
  acquireXboxServiceSecurityToken,
} from '@/features/user/api/login';
import { saveTokenToCache } from '@/features/user/api/mcToken';
import { loginRequest } from '@/features/user/const/authConfig';
import type { SilentRequest } from '@azure/msal-browser';

const Home = () => {
  const { instance, inProgress, accounts } = useMsal();
  const [isInitialized, setState] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  useEffect(() => {
    (async () => {
      await instance.initialize();
      await instance.handleRedirectPromise();
      setState(true);
    })().catch((e) => console.log(e));
  }, [instance]);

  useEffect(() => {
    (async () => {
      if (isInitialized && accounts.length > 0) {
        const requestWithAccount: SilentRequest = {
          ...loginRequest,
          account: accounts[0],
        };

        await instance
          .acquireTokenSilent(requestWithAccount)
          .then(async (r) => {
            const token = r.accessToken;

            const xblToken = await acquireXboxLiveToken(token);
            const xstsToken = await acquireXboxServiceSecurityToken(xblToken);
            const mcAccessToken = await acquireMinecraftAccessToken(xstsToken);

            saveTokenToCache(mcAccessToken);
          });

        if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          router.push('/');
        }
      } else if (isInitialized && inProgress === InteractionStatus.None) {
        const callbackQuery = new URLSearchParams({
          callbackUrl: callbackUrl ?? '/',
        }).toString();
        instance
          .loginRedirect({
            ...loginRequest,
            redirectStartPage: `/login?${callbackQuery}`,
          })
          .catch((e) => console.log(e));
      }
    })().catch((e) => console.log(e));
  }, [inProgress, accounts, isInitialized, instance, router]);

  return <></>;
};

export default Home;
