'use client';

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { ReactNode } from 'react';
import { SWRConfig, type Revalidator, type RevalidatorOptions } from 'swr';

import { MsalProvider } from '@/app/_components/MsalProvider';
import { fetcher } from '@/app/_swr/fetcher';
import { isHttpError } from '@/lib/httpError';

import { getAuthedTheme } from './getAuthedTheme';

const theme = getAuthedTheme();
const MAX_TIMEOUT_MS = 2_147_483_647;

const retryAfterRateLimit = (
  error: unknown,
  revalidate: Revalidator,
  options: Required<RevalidatorOptions>
) => {
  if (!isHttpError(error) || error.status !== 429) return false;

  const retryAfter = error.retryAfter;
  if (retryAfter === undefined) return true;

  const retryDelayMs = Math.min(retryAfter * 1000, MAX_TIMEOUT_MS);
  setTimeout(
    () => {
      void revalidate({ ...options, retryCount: options.retryCount + 1 });
    },
    Math.max(retryDelayMs, 1)
  );
  return true;
};

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
          onErrorRetry: (error, _key, _config, revalidate, options) => {
            if (retryAfterRateLimit(error, revalidate, options)) return;
            if (options.retryCount >= 3) return;
            setTimeout(() => {
              void revalidate({
                ...options,
                retryCount: options.retryCount + 1,
              });
            }, 5000);
          },
        }}
      >
        <MsalProvider clientId={msalClientId} redirectUri={msalRedirectUri}>
          {children}
        </MsalProvider>
      </SWRConfig>
    </ThemeProvider>
  </AppRouterCacheProvider>
);
