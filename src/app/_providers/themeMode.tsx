'use client';

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { ReactNode } from 'react';
import { SWRConfig } from 'swr';

import { MsalProvider } from '@/app/_components/MsalProvider';
import { fetcher } from '@/app/_swr/fetcher';

import { getAuthedTheme } from './getAuthedTheme';

const theme = getAuthedTheme();

export const AppProviders = ({
  children,
  msalClientId,
  msalRedirectUri,
}: {
  children: ReactNode;
  msalClientId: string;
  msalRedirectUri: string;
}) => (
  <AppRouterCacheProvider>
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <MsalProvider clientId={msalClientId} redirectUri={msalRedirectUri}>
          {children}
        </MsalProvider>
      </SWRConfig>
    </ThemeProvider>
  </AppRouterCacheProvider>
);
