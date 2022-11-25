import { isNaturalNumber } from '../naturalNumber';

describe('assertNumber', () => {
  it('should return false when given zero', () => {
    expect(isNaturalNumber(0)).toBeFalsy();
  });
});

export {};
