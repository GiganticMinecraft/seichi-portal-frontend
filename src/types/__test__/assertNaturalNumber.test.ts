import { isNaturalNumber } from '../naturalNumber';

describe('isNaturalNumber', () => {
  it('should return false when given zero', () => {
    expect(isNaturalNumber(0)).toBeFalsy();
  });
});
