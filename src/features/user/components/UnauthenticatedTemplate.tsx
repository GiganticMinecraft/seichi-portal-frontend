import { getCachedToken } from '../api/mcToken';
import type { ReactNode } from 'react';

type Props = { children: ReactNode };

export const UnauthenticatedTemplate = async ({ children }: Props) => {
  const isUnauthenticated = !(await getCachedToken());

  return isUnauthenticated ? <>{children}</> : null;
};
