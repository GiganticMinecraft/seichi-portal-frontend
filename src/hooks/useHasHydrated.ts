'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => {
  return () => {};
};

export const useHasHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
