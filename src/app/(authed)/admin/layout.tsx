import { requireAdmin } from '@/lib/server/session';
import NavBar from '@/app/_components/NavBar';
import SearchField from './_components/SearchField';
import DashboardMenu from './_components/DashboardMenu';
import styles from '../../page.module.css';
import type { ReactNode } from 'react';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  await requireAdmin();

  return (
    <>
      <NavBar homeHref="/admin" searchSlot={<SearchField />} withDrawerZIndex />
      <main className={styles['main']}>
        <DashboardMenu />
        {children}
      </main>
    </>
  );
};

export default RootLayout;
