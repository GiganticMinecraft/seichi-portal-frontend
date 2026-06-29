import './globals.css';
import { AppProviders } from './_providers/themeMode';
import { getMsalConfig } from '@/env.server';
import type { ReactNode } from 'react';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const msalConfig = getMsalConfig();

  return (
    <html lang="ja">
      <body>
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
