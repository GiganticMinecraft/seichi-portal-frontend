import { describe, expect, it } from 'vitest';
import {
  toOptionalQueryState,
  toRequiredQueryState,
} from '@/app/_swr/queryState';
import type { QuerySnapshot } from '@/app/_swr/queryState';

const loading = <T>(): QuerySnapshot<T> => ({
  data: undefined,
  error: undefined,
  isLoading: true,
});

const ready = <T>(data: T): QuerySnapshot<T> => ({
  data,
  error: undefined,
  isLoading: false,
});

const empty = <T>(): QuerySnapshot<T> => ({
  data: undefined,
  error: undefined,
  isLoading: false,
});

const failed = <T>(error: unknown): QuerySnapshot<T> => ({
  data: undefined,
  error,
  isLoading: false,
});

describe('toRequiredQueryState', () => {
  it('前提が満たされていない query を blocked として扱う', () => {
    expect(toRequiredQueryState(ready('data'), { enabled: false })).toEqual({
      kind: 'blocked',
    });
  });

  it('失敗した query を error として扱う', () => {
    const error = new Error('failed');

    expect(toRequiredQueryState(failed(error))).toEqual({
      kind: 'error',
      error,
    });
  });

  it('読み込み中または data がない必須 query を loading として扱う', () => {
    expect(toRequiredQueryState(loading<string>())).toEqual({
      kind: 'loading',
    });
    expect(toRequiredQueryState(empty<string>())).toEqual({
      kind: 'loading',
    });
  });

  it('data がある必須 query を ready として扱う', () => {
    expect(toRequiredQueryState(ready('data'))).toEqual({
      kind: 'ready',
      data: 'data',
    });
  });
});

describe('toOptionalQueryState', () => {
  it('失敗した query を error として扱う', () => {
    const error = new Error('failed');

    expect(toOptionalQueryState(failed(error))).toEqual({
      kind: 'error',
      error,
    });
  });

  it('読み込み中の任意 query を loading として扱う', () => {
    expect(toOptionalQueryState(loading<string>())).toEqual({
      kind: 'loading',
    });
  });

  it('data がない任意 query も ready として扱う', () => {
    expect(toOptionalQueryState(empty<string>())).toEqual({
      kind: 'ready',
      data: undefined,
    });
  });

  it('data がある任意 query を ready として扱う', () => {
    expect(toOptionalQueryState(ready('data'))).toEqual({
      kind: 'ready',
      data: 'data',
    });
  });
});
