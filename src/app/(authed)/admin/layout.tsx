import '../../globals.css';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import { AuthenticatedTemplate } from '@/features/user/components/AuthenticatedTemplate';
import { MsalProvider } from '@/features/user/components/MsalProvider';
import { NeedToSignin } from '@/features/user/components/NeedToSignin';
import { UnauthenticatedTemplate } from '@/features/user/components/UnauthenticatedTemplate';
import styles from '../../page.module.css';
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
        <main className={styles['main']}>
          <MsalProvider>
            <NavBar />
            <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <NeedToSignin />
            </UnauthenticatedTemplate>
          </MsalProvider>
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
