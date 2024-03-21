'use client';

import { MS_APP_REDIRECT_URL } from '@/env';
import {
  acquireMinecraftAccessToken,
  acquireXboxLiveToken,
  acquireXboxServiceSecurityToken,
} from '@/features/user/api/login';
import { saveTokenToCache } from '@/features/user/api/mcToken';
import { loginRequest } from '@/features/user/const/authConfig';
import { useMsal } from '@azure/msal-react';
import { useEffect, useTransition } from 'react';

const Home = () => {
  const { instance } = useMsal();
  const [_isPending, startTransition] = useTransition();

  if (typeof window === 'undefined') return <></>;

  useEffect(() => {
    (async () => {
      await instance.initialize();
      const request = {
        ...loginRequest,
        redirectStartPage: MS_APP_REDIRECT_URL,
      };
      await instance.loginRedirect(request).then(async () => {
        const token = await instance
          .acquireTokenSilent(loginRequest)
          .catch(async () => instance.acquireTokenPopup(loginRequest))
          .then((r) => r.accessToken);

        console.log(token);

        const xblToken = await acquireXboxLiveToken(token);
        const xstsToken = await acquireXboxServiceSecurityToken(xblToken);
        const mcAccessToken = await acquireMinecraftAccessToken(xstsToken);

        saveTokenToCache(mcAccessToken);
      });
    })();
  }, []);

  return <></>;
};

export default Home;
