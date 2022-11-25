import { isNonEmptyString, isNonEmptyStringList } from '../nonEmptyString';

describe('isNonEmptyString', () => {
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

describe('isNonEmptyStringList', () => {
  it('should return true when given non empty string values list', () => {
    expect(
      isNonEmptyStringList(['How about dancing with me?', 'Good night, Sir']),
    ).toBeTruthy();
  });

  it('should return true when given empty list', () => {
    expect(isNonEmptyStringList([])).toBeTruthy();
  });

  it('should return false when given empty string values list', () => {
    expect(isNonEmptyStringList(['', '', ''])).toBeFalsy();
  });
});
