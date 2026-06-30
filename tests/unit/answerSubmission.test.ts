import { describe, expect, it } from 'vitest';

import { TEMPORARY_USER_FIELDS } from '@/app/(public)/forms/[formId]/_components/answerFormTypes';
import { toAnswerContents } from '@/app/(public)/forms/[formId]/_components/useAnswerSubmission';
import { parseSubmissionError } from '@/app/(public)/forms/[formId]/_lib/submissionErrors';

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
