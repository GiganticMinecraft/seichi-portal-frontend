import { describe, expect, it } from 'vitest';

import { resolveAnswerUnavailableReason } from '@/lib/forms/answerUnavailable';
import { HttpError } from '@/lib/httpError';

const httpError = (status: number, errorCode?: string) =>
  new HttpError({
    message: `HTTP ${status}`,
    status,
    url: 'http://localhost/api/v1/forms/form-1/answers/answer-1',
    body: errorCode === undefined ? undefined : { errorCode },
  });

describe('resolveAnswerUnavailableReason', () => {
  it('エラーが無ければ undefined', () => {
    expect(
      resolveAnswerUnavailableReason([undefined, undefined, undefined])
    ).toBeUndefined();
  });

  it('404 以外のエラーは対象外 (通常のエラー処理に任せる)', () => {
    expect(
      resolveAnswerUnavailableReason([httpError(500), new Error('network')])
    ).toBeUndefined();
    expect(resolveAnswerUnavailableReason([httpError(403)])).toBeUndefined();
  });

  it('FORM_NOT_FOUND の 404 はフォーム側の理由になる', () => {
    expect(
      resolveAnswerUnavailableReason([httpError(404, 'FORM_NOT_FOUND')])
    ).toBe('form-not-found');
  });

  it('ANSWER_NOT_FOUND や errorCode の無い 404 は回答側の理由になる', () => {
    expect(
      resolveAnswerUnavailableReason([httpError(404, 'ANSWER_NOT_FOUND')])
    ).toBe('answer-not-found');
    expect(resolveAnswerUnavailableReason([httpError(404)])).toBe(
      'answer-not-found'
    );
  });

  it('どのクエリが先に 404 を返しても、FORM_NOT_FOUND が 1 つでもあればフォーム側の理由を優先する', () => {
    // 回答本体はまだエラー無し、コメントだけが先に FORM_NOT_FOUND を返した
    expect(
      resolveAnswerUnavailableReason([
        undefined,
        undefined,
        httpError(404, 'FORM_NOT_FOUND'),
      ])
    ).toBe('form-not-found');
    // 関連回答が errorCode 無しの 404、回答本体が FORM_NOT_FOUND
    expect(
      resolveAnswerUnavailableReason([
        httpError(404, 'FORM_NOT_FOUND'),
        httpError(404),
        undefined,
      ])
    ).toBe('form-not-found');
  });

  it('404 と他のエラーが混ざっていても 404 を優先して表示できない理由にする', () => {
    expect(
      resolveAnswerUnavailableReason([
        httpError(404, 'ANSWER_NOT_FOUND'),
        httpError(500),
      ])
    ).toBe('answer-not-found');
  });
});
