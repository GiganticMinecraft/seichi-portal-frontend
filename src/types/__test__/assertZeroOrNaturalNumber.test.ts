import { isZeroOrNaturalNumber } from '../zeroOrNaturalNumber';

describe('assertNumber', () => {
  it.each([1, 100, 10000])(
    'should return true when given positive integers',
    (value) => {
      expect(isZeroOrNaturalNumber(value)).toBeTruthy();
    },
  );

  it('should return true when given zero', () => {
    expect(isZeroOrNaturalNumber(0)).toBeTruthy();
  });

  it.each([-1, -100, -10000])(
    'should return false when given negative integers',
    (value) => {
      expect(isZeroOrNaturalNumber(value)).toBeFalsy();
    },
  );

  it.each([1.5, 9.7, -2.3, -8.7])(
    'should return false when given decimal numbers',
    (value) => {
      expect(isZeroOrNaturalNumber(value)).toBeFalsy();
    },
  );
});

export {};
