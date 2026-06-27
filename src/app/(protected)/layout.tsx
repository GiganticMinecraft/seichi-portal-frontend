import { requireUser } from '@/lib/server/session';
import type { ReactNode } from 'react';

// ログイン必須ルートのゲート。未ログインなら requireUser がログインへ誘導する。
// <html>/<body> と provider は共有 root layout（src/app/layout.tsx）が持つ。
const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
  await requireUser();

  return <>{children}</>;
};

export default ProtectedLayout;
