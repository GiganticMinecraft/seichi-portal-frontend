import '../globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import NavBar from '@/app/_components/NavBar';
import { MsalProvider } from '../_components/MsalProvider';
import styles from '../page.module.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Seichi Portal',
  description: '整地鯖公式のポータルサイトです。',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <AppRouterCacheProvider>
          <NavBar />
          <main className={styles['main']}>
            <MsalProvider>{children}</MsalProvider>
          </main>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
