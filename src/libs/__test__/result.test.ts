import { createErr, createOk } from 'option-t/lib/PlainResult';

import { matchForResult } from '../result';

describe('matchForResult', () => {
  test('should call whenOk if Ok value is given', () => {
    const whenOk = jest.fn();
    const whenErr = jest.fn();
    matchForResult(createOk(1), whenOk, whenErr);

    expect(whenOk).toHaveBeenCalled();
    expect(whenErr).not.toHaveBeenCalled();
  });

  test('should call whenErr if Err value is given', () => {
    const whenOk = jest.fn();
    const whenErr = jest.fn();
    matchForResult(createErr(1), whenOk, whenErr);

    expect(whenOk).not.toHaveBeenCalled();
    expect(whenErr).toHaveBeenCalled();
  });
});
