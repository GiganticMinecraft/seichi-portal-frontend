import './globals.css';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import type { ReactNode } from 'react';

import { getMsalConfig } from '@/env.server';

import { AppProviders } from './_providers/themeMode';

const RootLayout = ({ children }: { children: ReactNode }) => {
  const msalConfig = getMsalConfig();

  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript defaultMode="system" />
        <AppProviders
          msalClientId={msalConfig.clientId}
          msalRedirectUri={msalConfig.redirectUri}
        >
          {children}
        </AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
