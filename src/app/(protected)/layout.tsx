import type { ReactNode } from 'react';

import { AuthenticatedUserProvider } from '@/app/_providers/currentUser';
import { requireUser } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

// ログイン必須ルートのゲート。未ログインなら requireUser がログインへ誘導する。
// root layout は全体共通の provider だけを持ち、認証済みユーザーはここで提供する。
const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
  const session = await requireUser();

  return (
    <AuthenticatedUserProvider currentUser={session.user}>
      {children}
    </AuthenticatedUserProvider>
  );
};

export default ProtectedLayout;
