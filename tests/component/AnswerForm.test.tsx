import userEvent from '@testing-library/user-event';
import type { RefCallback } from 'react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import AnswerForm from '@/app/(public)/forms/[formId]/_components/AnswerForm';

import { renderWithProviders, screen } from './render';

const answerSubmissionMocks = vi.hoisted(() => ({
  useAnswerSubmission: vi.fn(),
  submitAnswers: vi.fn(),
  turnstileContainerRef: vi.fn<RefCallback<HTMLDivElement>>(),
}));

vi.mock(
  '@/app/(public)/forms/[formId]/_components/useAnswerSubmission',
  () => ({ useAnswerSubmission: answerSubmissionMocks.useAnswerSubmission })
);

vi.mock(
  '@/app/(public)/forms/[formId]/_components/AnswerSubmissionForm',
  () => ({
    default: ({
      turnstileContainerRef,
    }: {
      turnstileContainerRef?: RefCallback<HTMLDivElement>;
    }) => (
      <div data-testid="answer-submission-form">
        <div ref={turnstileContainerRef} data-testid="turnstile-container" />
      </div>
    ),
  })
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
  it('送信成功後はTurnstileコンテナが消え、別の回答をする操作で再度渡される', async () => {
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

    // 送信成功直後は AnswerSubmissionForm ごと Turnstile コンテナも消えている。
    expect(
      screen.getByRole('button', { name: '別の回答をする' })
    ).toBeVisible();
    expect(screen.queryByTestId('turnstile-container')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '別の回答をする' }));

    // 再度入力画面に戻ると、同じ containerRef が渡され Turnstile コンテナが復活する。
    expect(screen.getByTestId('answer-submission-form')).toBeInTheDocument();
    expect(screen.getByTestId('turnstile-container')).toBeInTheDocument();
  });
});
