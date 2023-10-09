import './globals.css';
import { Inter } from 'next/font/google';
import { AuthenticatedTemplate } from '@/components/AuthenticatedTemplate';
import { MsalProvider } from '@/components/MsalProvider';
import NavBar from '@/components/NavBar';
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
          <MsalProvider>
            <NavBar />
            <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
          </MsalProvider>
        </main>
      </body>
    </html>
  );
}
