'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import type { CurrentUser } from '@/lib/currentUser';

const CurrentUserContext = createContext<CurrentUser | null>(null);

export const AuthenticatedUserProvider = ({
  children,
  currentUser,
}: {
  children: ReactNode;
  currentUser: CurrentUser;
}) => (
  <CurrentUserContext.Provider value={currentUser}>
    {children}
  </CurrentUserContext.Provider>
);

export const useCurrentUser = () => {
  const currentUser = useContext(CurrentUserContext);

  if (!currentUser) {
    throw new Error(
      'useCurrentUser must be used within AuthenticatedUserProvider'
    );
  }

  return currentUser;
};

export const useOptionalCurrentUser = () => useContext(CurrentUserContext);
