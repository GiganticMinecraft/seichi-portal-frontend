import { getCachedToken } from '@/api/mcToken';
import type { ReactNode } from 'react';

type Props = { children: ReactNode };

export const UnauthenticatedTemplate = ({ children }: Props) => {
  const isUnauthenticated = !getCachedToken();

  return isUnauthenticated ? <>{children}</> : null;
};
