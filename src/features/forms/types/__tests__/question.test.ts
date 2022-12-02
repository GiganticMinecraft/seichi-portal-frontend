/* eslint-disable @typescript-eslint/naming-convention */
import { formList } from '@/__mocks__/data';

import { isQuestion, isQuestionList } from '../question';

beforeAll(() => {
  expect(formList.length >= 1).toBeTruthy();
  expect(formList[0].questions.length >= 1).toBeTruthy();
});

const list = formList[0].questions;

describe('isQuestion', () => {
  it('should return true when given the legal value', () => {
    expect(isQuestion(list[0])).toBeTruthy();
  });

  it('should return false when given the value without id', () => {
    const { id: _, ...value } = list[0];
    expect(isQuestion(value)).toBeFalsy();
  });

  it('should return false when given the value without title', () => {
    const { title: _, ...value } = list[0];
    expect(isQuestion(value)).toBeFalsy();
  });

  it('should return false when given the value without description', () => {
    const { description: _, ...value } = list[0];
    expect(isQuestion(value)).toBeFalsy();
  });

  it('should return false when given the value without type', () => {
    const { type: _, ...value } = list[0];
    expect(isQuestion(value)).toBeFalsy();
  });

  it('should return true when given the value without choices', () => {
    const { choices: _, ...value } = list[0];
    expect(isQuestion(value)).toBeTruthy();
  });

  it('should return false when given an empty object', () => {
    expect(isQuestion({})).toBeFalsy();
  });
});

describe('isQuestionList', () => {
  it('should return true when given legal values list', () => {
    expect(isQuestionList(list)).toBeTruthy();
  });

  it('should return true when given empty list', () => {
    expect(isQuestionList([])).toBeTruthy();
  });

  it('should return false when given illegal values list', () => {
    expect(isQuestionList(['', '', ''])).toBeFalsy();
  });
});
