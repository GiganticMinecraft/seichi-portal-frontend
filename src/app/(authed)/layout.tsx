import '../globals.css';
import { AuthedProviders } from './theme/themeMode';
import { requireUser } from '@/lib/server/session';
import type { ReactNode } from 'react';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await requireUser();

  return (
    <html lang="ja">
      <body>
        <AuthedProviders currentUser={session.user}>{children}</AuthedProviders>
      </body>
    </html>
  );
};

export default RootLayout;
