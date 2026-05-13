import '../globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import NavBar from '@/app/_components/NavBar';
import { MsalProvider } from '../_components/MsalProvider';
import { getMsalConfig } from '@/env.server';
import styles from '../page.module.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Seichi Portal',
  description: '整地鯖公式のポータルサイトです。',
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const msalConfig = getMsalConfig();
  return (
    <html lang="ja">
      <body>
        <AppRouterCacheProvider>
          <NavBar />
          <main className={styles['main']}>
            <MsalProvider
              clientId={msalConfig.clientId}
              redirectUri={msalConfig.redirectUri}
            >
              {children}
            </MsalProvider>
          </main>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
