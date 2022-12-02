import { isNumber } from '../assertNumber';

describe('isNumber', () => {
  it.each([1, 100, 10000, -1, -100, -10000, 1.5, -2.3])(
    'should return true when given number values',
    (value) => {
      expect(isNumber(value)).toBeTruthy();
    },
  );

  it.each(["It's me", 'Hello!', true, false, []])(
    'should return false when given not number values',
    (value) => {
      expect(isNumber(value)).toBeFalsy();
    },
  );
});
