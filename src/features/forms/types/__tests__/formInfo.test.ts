/* eslint-disable @typescript-eslint/naming-convention */
import { formInfoList as list } from '@/__mocks__/data';

import { isFormInfo, isFormInfoList } from '../formInfo';

beforeAll(() => expect(list.length >= 1).toBeTruthy());

describe('isFormInfo', () => {
  it('should return true when given the legal value', () => {
    expect(isFormInfo(list[0])).toBeTruthy();
  });

  it('should return false when given the value without id', () => {
    const { id: _, ...value } = list[0];
    expect(isFormInfo(value)).toBeFalsy();
  });

  it('should return false when given the value without description', () => {
    const { description: _, ...value } = list[0];
    expect(isFormInfo(value)).toBeFalsy();
  });

  it('should return false when given the value without title', () => {
    const { title: _, ...value } = list[0];
    expect(isFormInfo(value)).toBeFalsy();
  });

  it('should return false when given an empty object', () => {
    expect(isFormInfo({})).toBeFalsy();
  });
});

describe('isFormInfoList', () => {
  it('should return true when given legal values list', () => {
    expect(isFormInfoList(list)).toBeTruthy();
  });

  it('should return true when given empty list', () => {
    expect(isFormInfoList([])).toBeTruthy();
  });

  it('should return false when given illegal values list', () => {
    expect(isFormInfoList(['', '', ''])).toBeFalsy();
  });
});
