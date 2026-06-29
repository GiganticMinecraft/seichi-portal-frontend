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

type ReadyQuerySnapshot<T> = QuerySnapshot<T> & {
  data: T;
};

type QuerySnapshotData<T> = T extends QuerySnapshot<infer U> ? U : never;

type ReadyQuerySnapshots<T extends Record<string, QuerySnapshot<unknown>>> = {
  [K in keyof T]: ReadyQuerySnapshot<QuerySnapshotData<T[K]>>;
};

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

export const getRequiredQueryGroupError = (
  queries: Record<string, QuerySnapshot<unknown>>
): unknown | undefined =>
  Object.values(queries).find((query) => query.error !== undefined)?.error;

export const isQueryGroupReady = <
  const T extends Record<string, QuerySnapshot<unknown>>,
>(
  queries: T
): queries is T & ReadyQuerySnapshots<T> =>
  Object.values(queries).every(
    (query) =>
      query.error === undefined && !query.isLoading && query.data !== undefined
  );

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

export const getOptionalQueryData = <T>(
  query: QuerySnapshot<T>
): T | undefined =>
  query.error === undefined && !query.isLoading ? query.data : undefined;
