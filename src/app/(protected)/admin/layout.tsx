import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { getAdminAccess } from '@/lib/server/session';

import AdminShell from './_components/AdminShell';
import SearchField from './_components/SearchField';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const adminAccess = await getAdminAccess();

  if (adminAccess.state === 'forbidden') {
    redirect('/home?accessDenied=admin');
  }

  return <AdminShell searchSlot={<SearchField />}>{children}</AdminShell>;
};

export default RootLayout;
