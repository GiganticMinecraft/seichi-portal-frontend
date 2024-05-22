import '../globals.css';
import { Inter } from 'next/font/google';
import NavBar from '@/app/_components/NavBar';
import { MsalProvider } from '../_components/MsalProvider';
import styles from '../page.module.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Seichi Portal',
  description: '整地鯖公式のポータルサイトです。',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <NavBar />
        <main className={styles['main']}>
          <MsalProvider>{children}</MsalProvider>
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
