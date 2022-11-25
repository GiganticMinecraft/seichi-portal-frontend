import { isNonEmptyString } from '../nonEmptyString';

describe('assertNonEmptyString', () => {
  it.each(['How about dancing with me?', 'Good night, Sir'])(
    'should return true when given non empty string values',
    (value) => {
      expect(isNonEmptyString(value)).toBeTruthy();
    },
  );

  it('should return false when given empty string values', () => {
    expect(isNonEmptyString('')).toBeFalsy();
  });
});

export {};
