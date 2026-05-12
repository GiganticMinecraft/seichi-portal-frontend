import { requireAdmin } from '@/lib/server/session';
import AdminNavigationBar from './_components/AdminNavigationBar';
import DashboardMenu from './_components/DashboardMenu';
import styles from '../../page.module.css';
import type { ReactNode } from 'react';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await requireAdmin();

  return (
    <>
      <AdminNavigationBar currentUser={session.user} />
      <main className={styles['main']}>
        <DashboardMenu />
        {children}
      </main>
    </>
  );
};

export default RootLayout;
