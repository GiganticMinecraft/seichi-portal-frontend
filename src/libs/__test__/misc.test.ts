import { rangeIter } from '../misc';

describe('rangeIter', () => {
  test.each`
    start  | length | expected
    ${1}   | ${3}   | ${[1, 2, 3]}
    ${2}   | ${0}   | ${[]}
    ${-1}  | ${-3}  | ${[]}
    ${-5}  | ${2}   | ${[-5, -4]}
    ${-8}  | ${0}   | ${[]}
    ${1.3} | ${2}   | ${[1.3, 2.3]}
  `(
    'should return number generator with the range',
    ({ start, length, expected }) => {
      expect([...rangeIter(start, length)]).toEqual(expected);
    },
  );
});
