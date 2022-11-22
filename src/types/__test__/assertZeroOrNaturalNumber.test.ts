import { assertZeroOrNaturalNumber } from '../zeroOrNaturalNumber';

describe('assertNumber', () => {
  it.each([1, 100, 10000])(
    'should success to assert positive numbers',
    (value) => {
      expect(() => assertZeroOrNaturalNumber(value)).not.toThrowError();
    },
  );

  it('should success to assert zero', () => {
    expect(() => assertZeroOrNaturalNumber(0)).not.toThrowError();
  });

  it.each([-1, -100, -10000])(
    'should fail to assert negative integers',
    (value) => {
      expect(() => assertZeroOrNaturalNumber(value)).toThrowError();
    },
  );

  it.each([1.5, 9.7, -2.3, -8.7])(
    'should fail to assert decimal numbers',
    (value) => {
      expect(() => assertZeroOrNaturalNumber(value)).toThrowError();
    },
  );
});

export {};
