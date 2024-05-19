'use client';

import '../../globals.css';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Inter } from 'next/font/google';
import { MsalProvider } from '@/features/user/components/MsalProvider';
import AdminNavigationBar from './_components/AdminNavigationBar';
import DashboardMenu from './_components/DashboardMenu';
import adminDashboardTheme from './theme/adminDashboardTheme';
import styles from '../../page.module.css';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        <title>Seichi Portal Admin</title>
      </head>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={adminDashboardTheme}>
            <CssBaseline />
            <MsalProvider>
              <AdminNavigationBar />
              <main className={styles['main']}>
                <DashboardMenu />
                {children}
              </main>
            </MsalProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
