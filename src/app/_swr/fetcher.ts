import { right, left } from 'fp-ts/lib/Either';
import type { Either } from 'fp-ts/lib/Either';

export const jsonFetcher: (url: string) => Promise<Either<any, any>> = (
  url: string
) =>
  fetch(url).then((res) => {
    if (res.ok) {
      return res.json().then((json) => right(json));
    } else {
      return res.json().then((json) => left(json));
    }
  });
