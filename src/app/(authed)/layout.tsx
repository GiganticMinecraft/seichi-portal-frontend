import '../globals.css';
import { AuthedProviders } from './theme/themeMode';
import { requireUser } from '@/lib/server/session';
import { getMsalConfig } from '@/env.server';
import type { ReactNode } from 'react';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await requireUser();
  const msalConfig = getMsalConfig();

  return (
    <html lang="ja">
      <body>
        <AuthedProviders
          currentUser={session.user}
          msalClientId={msalConfig.clientId}
          msalRedirectUri={msalConfig.redirectUri}
        >
          {children}
        </AuthedProviders>
      </body>
    </html>
  );
};

export default RootLayout;
