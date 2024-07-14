'use client';

import '../../globals.css';
import { Inter } from 'next/font/google';
import { SWRConfig } from 'swr';
import NavBar from '@/app/_components/NavBar';
import { jsonFetcher } from '@/app/_swr/fetcher';
import styles from '../../page.module.css';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        <title>Seichi Portal</title>
        <meta name="description" content="整地鯖公式のポータルサイトです。" />
      </head>
      <body className={inter.className}>
        <main className={styles['main']}>
          <SWRConfig
            value={{
              fetcher: jsonFetcher,
            }}
          >
            <NavBar />
            {children}
          </SWRConfig>
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
