export type NonEmptyArray<T> = [T, ...T[]];

enum LeftOrRight {
  Right,
  Left,
}

type Right<T> = {
  type: LeftOrRight.Right;
  payload: T;
};

type Left<T> = {
  type: LeftOrRight.Left;
  payload: T;
};

export type Either<T, U> = Left<T> | Right<U>;

export function left<T>(payload: T): Left<T> {
  return {
    type: LeftOrRight.Left,
    payload,
  };
}

export function right<T>(payload: T): Right<T> {
  return {
    type: LeftOrRight.Right,
    payload,
  };
}

export function map<A, B, C>(
  either: Either<A, B>,
  f: (arg0: B) => C
): Either<A, C> {
  if (either.type == LeftOrRight.Left) {
    return either;
  } else {
    return right(f(either.payload));
  }
}
