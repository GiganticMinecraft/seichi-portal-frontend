import { describe, expect, it } from 'vitest';
import { parseSubmissionError } from '@/app/(public)/forms/[formId]/_components/useAnswerSubmission';

describe('parseSubmissionError', () => {
  it('制限エラーの nullable な解除予定を送信用 model に変換する', () => {
    expect(
      parseSubmissionError({
        detail: 'restricted',
        errorCode: 'ANSWER_SUBMISSION_RESTRICTED',
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

  it('制限エラーの解除予定日時を区別する', () => {
    expect(
      parseSubmissionError({
        detail: 'restricted',
        errorCode: 'ANSWER_SUBMISSION_RESTRICTED',
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
