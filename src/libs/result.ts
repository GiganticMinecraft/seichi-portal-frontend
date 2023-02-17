// https://qiita.com/frozenbonito/items/e708dfb3ab7c1fd3824d#%E4%BE%8B%E5%A4%96%E3%82%92-throw-%E3%81%99%E3%82%8B%E9%96%A2%E6%95%B0%E3%82%92%E6%89%B1%E3%81%86
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

export type Result<T, E extends Error> = Success<T> | Failure<E>;

export type PromiseResult<T, E extends Error> = Promise<Result<T, E>>;

export class Success<T> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isSuccess(): this is Success<T> {
    return true;
  }

  isFailure(): this is Failure<Error> {
    return false;
  }
}

export class Failure<E extends Error> {
  readonly error: E;

  constructor(error: E) {
    this.error = error;
  }

  isSuccess(): this is Success<unknown> {
    return false;
  }

  isFailure(): this is Failure<E> {
    return true;
  }
}

export const success = <T>(value: T) => new Success(value);

export const failure = <E extends Error>(error: E) => new Failure(error);

// TODO: add tests

export const unwrap = <T, E extends Error>(result: Result<T, E>): T => {
  if (result.isFailure()) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw result.error;
  }

  return result.value;
};

export const tryCatch = <T, E extends Error>(
  func: () => T,
  // 発生する例外は`any`なので適切な型に変換するための関数を与える
  onCatch: (e: unknown) => E,
): Result<T, E> => {
  try {
    const value = func();

    return new Success<T>(value);
  } catch (err) {
    return new Failure<E>(onCatch(err));
  }
};

export const tryCatchAsync = async <T, E extends Error>(
  func: () => Promise<T>,
  // 発生する例外は`any`なので適切な型に変換するための関数を与える
  onCatch: (e: unknown) => E,
): PromiseResult<T, E> =>
  func()
    .then((value) => new Success<T>(value))
    .catch((err) => new Failure<E>(onCatch(err)));

export const promiseAll = <T, E extends Error>(
  // 本来の`Promise.all()`は、PromiseLikeや非Promiseな値も受け付けるが、簡易化するため`PromiseResult`の配列に限定している
  values: readonly PromiseResult<T, E>[],
): PromiseResult<T[], E> =>
  new Promise<Result<T[], E>>((resolve, reject) => {
    const results: T[] = [];
    values.forEach((v) => {
      v.then((result) => {
        if (result.isFailure()) {
          resolve(result);

          return;
        }
        results.push(result.value);

        if (results.length === values.length) {
          resolve(new Success(results));
        }
      }).catch(reject);
    });
  });
