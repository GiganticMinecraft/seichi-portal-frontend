import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import NavBar from '@/app/_components/NavBar';
import { AuthenticatedUserProvider } from '@/app/_providers/currentUser';
import { getSession } from '@/lib/server/session';

import styles from '../page.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Seichi Portal',
  description: '整地鯖公式のポータルサイトです。',
};

// ログイン任意の公開ルート。<html>/<body> と provider は共有 root layout が持つ。
// サインイン済みの場合は NavBar がユーザーメニューを表示できるよう Context を注入する。
const PublicLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();
  const content = (
    <>
      <NavBar />
      <main className={styles['main']}>{children}</main>
    </>
  );

  if (session.state !== 'authenticated') {
    return content;
  }

  return (
    <AuthenticatedUserProvider currentUser={session.user}>
      {content}
    </AuthenticatedUserProvider>
  );
};

export default PublicLayout;
