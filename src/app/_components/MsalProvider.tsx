'use client';

import { EventType, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider as MsalLibProvider } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { shouldReloadForMsalRedirectRecovery } from './msalRedirectState';
import type { Configuration } from '@azure/msal-browser';
import type { ReactNode } from 'react';

let msalInstance: PublicClientApplication | null = null;

const initMsalInstance = (config: {
  clientId: string;
  redirectUri: string;
}) => {
  if (msalInstance) return msalInstance;
  const msalConfig: Configuration = {
    auth: {
      clientId: config.clientId,
      authority: 'https://login.microsoftonline.com/consumers',
      redirectUri: config.redirectUri,
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false,
    },
  };
  msalInstance = new PublicClientApplication(msalConfig);
  return msalInstance;
};

export const getMsalInstance = () => {
  if (!msalInstance)
    throw new Error(
      'MsalProvider が初期化される前に getMsalInstance() が呼ばれました'
    );
  return msalInstance;
};

type Props = {
  clientId: string;
  redirectUri: string;
  children: ReactNode;
};

export const MsalProvider = ({ clientId, redirectUri, children }: Props) => {
  const [instance] = useState(() =>
    initMsalInstance({ clientId, redirectUri })
  );

  useEffect(() => {
    const callbackId = instance.addEventCallback((message) => {
      if (message.eventType !== EventType.RESTORE_FROM_BFCACHE) return;
      if (!shouldReloadForMsalRedirectRecovery()) return;
      window.location.reload();
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  return <MsalLibProvider instance={instance}>{children}</MsalLibProvider>;
};
