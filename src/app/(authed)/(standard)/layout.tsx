'use client';

import '../../globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { SWRConfig } from 'swr';
import NavBar from '@/app/_components/NavBar';
import { fetcher } from '@/app/_swr/fetcher';
import styles from '../../page.module.css';
import type { ReactNode } from 'react';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        <title>Seichi Portal</title>
        <meta name="description" content="整地鯖公式のポータルサイトです。" />
      </head>
      <body>
        <AppRouterCacheProvider>
          <main className={styles['main']}>
            <SWRConfig
              value={{
                fetcher: fetcher,
              }}
            >
              <NavBar />
              {children}
            </SWRConfig>
          </main>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
