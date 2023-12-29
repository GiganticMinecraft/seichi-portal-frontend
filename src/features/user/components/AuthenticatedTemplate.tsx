import { getCachedToken } from '../api/mcToken';
import type { ReactNode } from 'react';

type Props = { children: ReactNode };

export const AuthenticatedTemplate = async ({ children }: Props) => {
  const isAuthenticated = !!(await getCachedToken());

  return isAuthenticated ? <>{children}</> : null;
};
