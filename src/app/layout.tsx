import './globals.css';
import type { ReactNode } from 'react';

import { getMsalConfig } from '@/env.server';

import { AppProviders } from './_providers/themeMode';

const RootLayout = ({ children }: { children: ReactNode }) => {
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
