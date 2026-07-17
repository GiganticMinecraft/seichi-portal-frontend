import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import NavBar from '@/app/_components/NavBar';
import { getAdminAccess } from '@/lib/server/session';

import styles from '../../page.module.css';

import DashboardMenu from './_components/DashboardMenu';
import SearchField from './_components/SearchField';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const adminAccess = await getAdminAccess();

  if (adminAccess.state === 'forbidden') {
    redirect('/home?accessDenied=admin');
  }

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
