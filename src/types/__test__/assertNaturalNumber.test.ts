import { assertNaturalNumber } from '../naturalNumber';

describe('assertNumber', () => {
  it('should fail to assert zero', () => {
    expect(() => assertNaturalNumber(0)).toThrowError();
  });
});

export {};
