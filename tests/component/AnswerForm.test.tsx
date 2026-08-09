import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import AnswerForm from '@/app/(public)/forms/[formId]/_components/AnswerForm';

import { renderWithProviders, screen } from './render';

const answerSubmissionMocks = vi.hoisted(() => ({
  useAnswerSubmission: vi.fn(),
  submitAnswers: vi.fn(),
  turnstileContainerRef: { current: null },
}));

vi.mock(
  '@/app/(public)/forms/[formId]/_components/useAnswerSubmission',
  () => ({ useAnswerSubmission: answerSubmissionMocks.useAnswerSubmission })
);

vi.mock(
  '@/app/(public)/forms/[formId]/_components/AnswerSubmissionForm',
  () => ({ default: () => <div data-testid="answer-submission-form" /> })
);

const props = {
  questions: [],
  formId: 'form-id',
  title: 'フォームタイトル',
  description: '',
  isAuthenticated: false,
  allowTemporaryAnswers: true,
  restriction: null,
  turnstileSiteKey: 'site-key',
};

describe('AnswerForm', () => {
  it('別の回答へ戻っても匿名回答のTurnstileコンテナを維持する', async () => {
    answerSubmissionMocks.useAnswerSubmission.mockImplementation(() => {
      // 成功画面から利用者が「別の回答をする」を押す経路を確認する。
      const [submissionState, setSubmissionState] = useState<
        { kind: 'editing' } | { kind: 'submitted' }
      >({ kind: 'submitted' });

      return {
        submissionState,
        submitAnswers: answerSubmissionMocks.submitAnswers,
        resetSubmissionState: () => {
          setSubmissionState({ kind: 'editing' });
        },
        turnstileContainerRef: answerSubmissionMocks.turnstileContainerRef,
      };
    });

    const user = userEvent.setup();
    renderWithProviders(<AnswerForm {...props} />);
    const container = answerSubmissionMocks.turnstileContainerRef.current;

    expect(
      screen.getByRole('button', { name: '別の回答をする' })
    ).toBeVisible();
    expect(container).toBeInstanceOf(HTMLDivElement);

    await user.click(screen.getByRole('button', { name: '別の回答をする' }));

    expect(screen.getByTestId('answer-submission-form')).toBeInTheDocument();
    expect(answerSubmissionMocks.turnstileContainerRef.current).toBe(container);
    expect(answerSubmissionMocks.turnstileContainerRef.current).toBeInstanceOf(
      HTMLDivElement
    );
  });
});
