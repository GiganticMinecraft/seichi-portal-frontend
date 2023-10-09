import { getCachedToken } from '@/api/mcToken';
import type { ReactNode } from 'react';

type Props = { children: ReactNode };

export const AuthenticatedTemplate = ({ children }: Props) => {
  const isAuthenticated = !!getCachedToken();

  return isAuthenticated ? <>{children}</> : null;
};
