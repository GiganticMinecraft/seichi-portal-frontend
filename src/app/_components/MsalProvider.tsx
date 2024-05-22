'use client';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider as MsalLibProvider } from '@azure/msal-react';
import { MS_APP_CLIENT_ID, MS_APP_REDIRECT_URL } from '@/env';
import type { Configuration } from '@azure/msal-browser';
import type { ReactNode } from 'react';

const msalConfig: Configuration = {
  auth: {
    clientId: MS_APP_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/consumers',
    redirectUri: MS_APP_REDIRECT_URL,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

type Props = {
  children: ReactNode;
};

export const MsalProvider = ({ children }: Props) => (
  <MsalLibProvider instance={msalInstance}>{children}</MsalLibProvider>
);
