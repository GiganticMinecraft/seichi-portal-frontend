import './globals.css';
import { AppProviders } from './_providers/themeMode';
import { getSession } from '@/lib/server/session';
import { getMsalConfig } from '@/env.server';
import type { ReactNode } from 'react';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();
  const msalConfig = getMsalConfig();

  return (
    <html lang="ja">
      <body>
        <AppProviders
          currentUser={session.state === 'authenticated' ? session.user : null}
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
