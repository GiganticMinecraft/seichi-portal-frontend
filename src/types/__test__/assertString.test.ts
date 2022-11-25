import { isString } from '../assertString';

describe('isString', () => {
  it.each(["It's me", 'Hello!', 'Did you see me?', "I'm behind you"])(
    'should return true when given string values',
    (value) => {
      expect(isString(value)).toBeTruthy();
    },
  );

  it.each([1, 100, -10, 0.1, true, false, []])(
    'should return false when given not string values',
    (value) => {
      expect(isString(value)).toBeFalsy();
    },
  );
});

export {};
