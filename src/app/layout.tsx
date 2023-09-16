import './globals.css';
import { Inter } from 'next/font/google';
import ButtonAppBar from '@/components/buttonAppBar';
import styles from './page.module.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Seichi Portal',
  description: '整地鯖公式のポータルサイトです。',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <main className={styles['main']}>
          <ButtonAppBar />
          {children}
        </main>
      </body>
    </html>
  );
}
