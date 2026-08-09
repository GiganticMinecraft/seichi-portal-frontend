import { describe, expect, it } from 'vitest';

import { TEMPORARY_USER_FIELDS } from '@/app/(public)/forms/[formId]/_components/answerFormTypes';
import { toAnswerContents } from '@/app/(public)/forms/[formId]/_components/useAnswerSubmission';
import { parseSubmissionError } from '@/app/(public)/forms/[formId]/_lib/submissionErrors';

describe('parseSubmissionError', () => {
  it('429はProblem Details本文が不正でもrate-limitとして扱いRetry-Afterを保持する', () => {
    expect(
      parseSubmissionError('upstream unavailable', {
        status: 429,
        headers: new Headers({ 'Retry-After': '4' }),
      })
    ).toEqual({ code: 'RATE_LIMIT_EXCEEDED', retryAfter: 4 });
  });

  it('制限エラーの nullable な解除予定を送信用 model に変換する', () => {
    expect(
      parseSubmissionError({
        detail: 'restricted',
        errorCode: 'SUBMISSION_RESTRICTED',
        status: 403,
        title: 'Forbidden',
        type: 'about:blank',
        restriction: {
          reason: '不適切な回答のため',
          expires_at: null,
        },
      })
    ).toEqual({
      code: 'RESTRICTED',
      restriction: {
        reason: '不適切な回答のため',
        expiration: { kind: 'indefinite' },
      },
    });
  });

  it('Turnstile検証失敗をTURNSTILE_FAILEDとして扱う', () => {
    expect(
      parseSubmissionError({
        detail: 'Turnstile verification failed.',
        errorCode: 'TURNSTILE_VERIFICATION_FAILED',
        status: 403,
        title: 'Forbidden',
        type: 'about:blank',
      })
    ).toEqual({ code: 'TURNSTILE_FAILED' });
  });

  it('Turnstile検証サービス不通をTURNSTILE_UNAVAILABLEとして扱う', () => {
    expect(
      parseSubmissionError({
        detail: 'Turnstile verification service is unavailable.',
        errorCode: 'TURNSTILE_UNAVAILABLE',
        status: 503,
        title: 'Service Unavailable',
        type: 'about:blank',
      })
    ).toEqual({ code: 'TURNSTILE_UNAVAILABLE' });
  });

  it('制限エラーの解除予定日時を区別する', () => {
    expect(
      parseSubmissionError({
        detail: 'restricted',
        errorCode: 'SUBMISSION_RESTRICTED',
        status: 403,
        title: 'Forbidden',
        type: 'about:blank',
        restriction: {
          reason: '不適切な回答のため',
          expires_at: '2026-07-01T12:34:00+09:00',
        },
      })
    ).toEqual({
      code: 'RESTRICTED',
      restriction: {
        reason: '不適切な回答のため',
        expiration: {
          kind: 'expiresAt',
          expiresAt: '2026-07-01T12:34:00+09:00',
        },
      },
    });
  });
});

describe('toAnswerContents', () => {
  it('未選択の単一選択回答を contents から除外する', () => {
    expect(
      toAnswerContents({
        [TEMPORARY_USER_FIELDS.name]: 'テスト太郎',
        '0c2a6f9a-28c2-4116-835b-fdd7289a16f1': '',
        '8f98a37f-9070-4624-b161-f288769160d5': '申請について',
      })
    ).toEqual([
      {
        question_id: '8f98a37f-9070-4624-b161-f288769160d5',
        answer: '申請について',
      },
    ]);
  });
});
