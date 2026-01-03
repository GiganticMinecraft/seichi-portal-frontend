'use client';

import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import type { SilentRequest } from '@azure/msal-browser';

const loginRequest = {
  scopes: ['XboxLive.signin offline_access'],
};

const LoginContent = () => {
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
      if (isInitialized && accounts.length > 0 && accounts[0]) {
        const requestWithAccount: SilentRequest = {
          account: accounts[0],
          ...loginRequest,
        };

        await instance
          .acquireTokenSilent(requestWithAccount)
          .then(async (r) => {
            const token = r.accessToken;

            await fetch('/api/minecraft-access-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            });
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
  }, [inProgress, accounts, isInitialized, instance, router, callbackUrl]);

  return <></>;
};

const Home = () => {
  return (
    // useSearchParams は Suspense で囲われている必要がある
    // https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
    <Suspense fallback={<></>}>
      <LoginContent />
    </Suspense>
  );
};

export default Home;
