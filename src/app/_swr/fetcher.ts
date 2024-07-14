import { right, left } from 'fp-ts/lib/Either';
import type { Either } from 'fp-ts/lib/Either';

// ここで any が使われているのは、fetch したときに返ってくる型がわからないためやむを得ず any にしている
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
