import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import NavBar from '@/app/_components/NavBar';

import styles from '../page.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Seichi Portal',
  description: '整地鯖公式のポータルサイトです。',
};

// ログイン任意の公開ルート。<html>/<body> と provider は共有 root layout が持つ。
const PublicLayout = ({ children }: { children: ReactNode }) => (
  <>
    <NavBar />
    <main className={styles['main']}>{children}</main>
  </>
);

export default PublicLayout;
