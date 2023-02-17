import { rangeIter } from '..';

describe('rangeIter', () => {
  test.each`
    start | length | expected
    ${0}  | ${3}   | ${[0, 1, 2]}
    ${0}  | ${0}   | ${[]}
    ${0}  | ${-3}  | ${[]}
    ${-5} | ${1}   | ${[-5]}
  `('should return ranged generator', ({ start, length, expected }) => {
    expect([...rangeIter(start, length)]).toEqual(expected);
  });
});
