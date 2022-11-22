import { assertNumber } from '../assertNumber';

describe('assertNumber', () => {
  it.each([1, 100, 10000, -1, -100, -10000, 1.5, -2.3])(
    'should success to assert number values',
    (value) => {
      expect(() => assertNumber(value)).not.toThrowError();
    },
  );

  it.each(["It's me", 'Hello!', true, false, []])(
    'should fail to assert not number values',
    (value) => {
      expect(() => assertNumber(value)).toThrowError();
    },
  );
});

export {};
