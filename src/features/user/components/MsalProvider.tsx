'use client';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider as MsalLibProvider } from '@azure/msal-react';
import { msalConfig } from '@/authConfig';
import type { ReactNode } from 'react';

const msalInstance = new PublicClientApplication(msalConfig);

type Props = {
  children: ReactNode;
};

export const MsalProvider = ({ children }: Props) => (
  <MsalLibProvider instance={msalInstance}>{children}</MsalLibProvider>
);
