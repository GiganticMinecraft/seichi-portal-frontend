import '../globals.css';
import { AuthedProviders } from './theme/themeMode';
import type { ReactNode } from 'react';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <AuthedProviders>{children}</AuthedProviders>
      </body>
    </html>
  );
};

export default RootLayout;
