import '../globals.css';
import { Inter } from 'next/font/google';
import styles from '../page.module.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { MsalProvider } from '@/features/user/components/MsalProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Seichi Portal',
  description: '整地鯖公式のポータルサイトです。',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <main className={styles['main']}>
          <MsalProvider>{children}</MsalProvider>
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
