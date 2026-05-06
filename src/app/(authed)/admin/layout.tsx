'use client';

import ErrorModal from '@/app/_components/ErrorModal';
import LoadingCircular from '@/app/_components/LoadingCircular';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import AdminNavigationBar from './_components/AdminNavigationBar';
import DashboardMenu from './_components/DashboardMenu';
import styles from '../../page.module.css';
import type { ReactNode } from 'react';

const AdminContent = ({ children }: { children: ReactNode }) => {
  const { data: me, error, isLoading } = useApiQuery('/users/me');

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
  return <AdminContent>{children}</AdminContent>;
};

export default RootLayout;
