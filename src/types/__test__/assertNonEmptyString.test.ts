import { assertNonEmptyString } from '../nonEmptyString';

describe('assertNonEmptyString', () => {
  it.each(['How about dancing with me?', 'Good night, Sir'])(
    'should success to assert non empty string values',
    (value) => {
      expect(() => assertNonEmptyString(value)).not.toThrowError();
    },
  );

  it('should fail to assert empty string values', () => {
    expect(() => assertNonEmptyString('')).toThrowError();
  });
});

export {};
