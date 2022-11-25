/* eslint-disable @typescript-eslint/naming-convention */
import { formList as list } from '@/__mocks__/data';

import { isForm } from '../form';

describe('isForm', () => {
  beforeAll(() => expect(list.length >= 1).toBeTruthy());

  it('should return true when given the legal value', () => {
    expect(isForm(list[0])).toBeTruthy();
  });

  it('should return false when given the value without id', () => {
    const { id: _, ...value } = list[0];
    expect(isForm(value)).toBeFalsy();
  });

  it('should return false when given the value without description', () => {
    const { description: _, ...value } = list[0];
    expect(isForm(value)).toBeFalsy();
  });

  it('should return false when given the value without title', () => {
    const { title: _, ...value } = list[0];
    expect(isForm(value)).toBeFalsy();
  });

  it('should return true when given the value without questions', () => {
    const { questions: _, ...value } = list[0];
    expect(isForm(value)).toBeTruthy();
  });

  it('should return false when given an empty object', () => {
    expect(isForm({})).toBeFalsy();
  });
});
