import { assertString } from '../assertString';

describe('assertString', () => {
  it.each(["It's me", 'Hello!', 'Did you see me?', "I'm behind you"])(
    'should success to assert string values',
    (value) => {
      expect(() => assertString(value)).not.toThrowError();
    },
  );

  it.each([1, 100, -10, 0.1, true, false, []])(
    'should fail to assert not string values',
    (value) => {
      expect(() => assertString(value)).toThrowError();
    },
  );
});

export {};
