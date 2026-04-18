'use client';

import '../../globals.css';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import useSWR, { SWRConfig } from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import { MsalProvider } from '@/app/_components/MsalProvider';
import { fetcher } from '@/app/_swr/fetcher';
import AdminNavigationBar from './_components/AdminNavigationBar';
import DashboardMenu from './_components/DashboardMenu';
import adminDashboardTheme from './theme/adminDashboardTheme';
import styles from '../../page.module.css';
import type { GetUsersResponse } from '@/lib/api-types';
import type { ReactNode } from 'react';

const AdminContent = ({ children }: { children: ReactNode }) => {
  const {
    data: me,
    error,
    isLoading,
  } = useSWR<GetUsersResponse>('/api/proxy/users/me', fetcher);

  if (error) {
    return <ErrorModal error={error} />;
  }

  if (isLoading || !me) {
    return <LoadingCircular />;
  }

  if (me.role !== 'ADMINISTRATOR') {
    return (
      <ErrorModal
        showDiagnostics={false}
        title="このページを表示する権限がありません。"
        message="管理者権限を持つアカウントでサインインしてください。"
      />
    );
  }

  return (
    <>
      <AdminNavigationBar />
      <main className={styles['main']}>
        <DashboardMenu />
        {children}
      </main>
    </>
  );
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        <title>Seichi Portal Admin</title>
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={adminDashboardTheme}>
            <CssBaseline />
            <SWRConfig
              value={{
                fetcher: fetcher,
              }}
            >
              <MsalProvider>
                <AdminContent>{children}</AdminContent>
              </MsalProvider>
            </SWRConfig>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
