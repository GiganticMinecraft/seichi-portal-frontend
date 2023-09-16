import ButtonAppBar from '@/components/buttonAppBar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import styles from './page.module.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Seichi Portal',
  description: '整地鯖公式のポータルサイトです。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
