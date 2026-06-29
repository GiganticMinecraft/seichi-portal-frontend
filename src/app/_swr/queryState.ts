'use client';

export type QuerySnapshot<T> = {
  data: T | undefined;
  error: unknown;
  isLoading: boolean;
};

export type RequiredQueryState<T> =
  | { kind: 'blocked' }
  | { kind: 'loading' }
  | { kind: 'error'; error: unknown }
  | { kind: 'ready'; data: T };

export type OptionalQueryState<T> =
  | { kind: 'loading' }
  | { kind: 'error'; error: unknown }
  | { kind: 'ready'; data: T | undefined };

export const toRequiredQueryState = <T>(
  query: QuerySnapshot<T>,
  options: { enabled: boolean } = { enabled: true }
): RequiredQueryState<T> => {
  if (!options.enabled) {
    return { kind: 'blocked' };
  }

  if (query.error !== undefined) {
    return { kind: 'error', error: query.error };
  }

  if (query.isLoading || query.data === undefined) {
    return { kind: 'loading' };
  }

  return { kind: 'ready', data: query.data };
};

export const toOptionalQueryState = <T>(
  query: QuerySnapshot<T>
): OptionalQueryState<T> => {
  if (query.error !== undefined) {
    return { kind: 'error', error: query.error };
  }

  if (query.isLoading) {
    return { kind: 'loading' };
  }

  return { kind: 'ready', data: query.data };
};
