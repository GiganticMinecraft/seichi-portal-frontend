import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  TEMPORARY_USER_FIELDS,
  type AnswerFormInput,
} from '@/app/(public)/forms/[formId]/_components/answerFormTypes';
import AnswerSubmissionForm from '@/app/(public)/forms/[formId]/_components/AnswerSubmissionForm';
import type { GetQuestionsResponse } from '@/lib/api-types';

import { renderWithProviders, screen, waitFor } from './render';

const questions: GetQuestionsResponse = [
  {
    id: '8f98a37f-9070-4624-b161-f288769160d5',
    template_key: 'consultation_topics',
    title: '相談したい内容',
    description: '複数選べます。',
    is_required: true,
    position: 1,
    question_type: 'MultipleChoice',
    choices: [
      { id: 1, label: '運営に相談したい', position: 1 },
      { id: 2, label: '申請内容を確認したい', position: 2 },
    ],
  },
];

const singleChoiceQuestions: GetQuestionsResponse = [
  {
    id: '0c2a6f9a-28c2-4116-835b-fdd7289a16f1',
    template_key: 'contact_reason',
    title: 'お問い合わせ種別',
    description: '',
    is_required: false,
    position: 1,
    question_type: 'SingleChoice',
    choices: [
      { id: 1, label: '申請について', position: 1 },
      { id: 2, label: 'その他', position: 2 },
    ],
  },
];

const requiredSingleChoiceQuestions: GetQuestionsResponse = [
  {
    id: '0c2a6f9a-28c2-4116-835b-fdd7289a16f1',
    template_key: 'contact_reason',
    title: 'お問い合わせ種別',
    description: '',
    is_required: true,
    position: 1,
    question_type: 'SingleChoice',
    choices: [
      { id: 1, label: '申請について', position: 1 },
      { id: 2, label: 'その他', position: 2 },
    ],
  },
];

describe('AnswerSubmissionForm', () => {
  it('一時回答者の入力値と質問の回答を submitter に渡す', async () => {
    const user = userEvent.setup();
    const onSubmitAnswers = vi
      .fn<(data: AnswerFormInput) => Promise<{ ok: boolean }>>()
      .mockResolvedValue({ ok: true });

    renderWithProviders(
      <AnswerSubmissionForm
        questions={questions}
        title="お問い合わせ"
        description="必要な情報を入力してください。"
        isTemporary
        onSubmitAnswers={onSubmitAnswers}
      />
    );

    await user.type(
      screen.getByRole('textbox', { name: /お名前/ }),
      'テスト太郎'
    );
    await user.type(
      screen.getByRole('textbox', { name: /連絡先/ }),
      'test-user@example.com'
    );
    await user.click(
      screen.getByRole('checkbox', { name: '運営に相談したい' })
    );
    await user.click(screen.getByRole('button', { name: '送信' }));

    await waitFor(() => {
      expect(onSubmitAnswers).toHaveBeenCalledWith({
        [TEMPORARY_USER_FIELDS.name]: 'テスト太郎',
        [TEMPORARY_USER_FIELDS.contactText]: 'test-user@example.com',
        '8f98a37f-9070-4624-b161-f288769160d5': ['運営に相談したい'],
      });
    });
  });

  it('複数選択の回答を成功送信後にリセットし、次の回答を選択できる', async () => {
    const user = userEvent.setup();
    const onSubmitAnswers = vi
      .fn<(data: AnswerFormInput) => Promise<{ ok: boolean }>>()
      .mockResolvedValue({ ok: true });

    renderWithProviders(
      <AnswerSubmissionForm
        questions={questions}
        title="お問い合わせ"
        description=""
        isTemporary={false}
        onSubmitAnswers={onSubmitAnswers}
      />
    );

    const firstChoice = screen.getByRole('checkbox', {
      name: '運営に相談したい',
    });
    const secondChoice = screen.getByRole('checkbox', {
      name: '申請内容を確認したい',
    });

    await user.click(secondChoice);
    await user.click(firstChoice);
    expect(firstChoice).toBeChecked();
    expect(secondChoice).toBeChecked();

    await user.click(screen.getByRole('button', { name: '送信' }));

    await waitFor(() => {
      expect(onSubmitAnswers).toHaveBeenCalledTimes(1);
    });
    expect(onSubmitAnswers).toHaveBeenNthCalledWith(1, {
      '8f98a37f-9070-4624-b161-f288769160d5': [
        '運営に相談したい',
        '申請内容を確認したい',
      ],
    });
    expect(firstChoice).not.toBeChecked();
    expect(
      firstChoice.parentElement?.querySelector('[data-testid="CheckBoxIcon"]')
    ).toBeNull();
    expect(secondChoice).not.toBeChecked();

    await user.click(secondChoice);
    expect(secondChoice).toBeChecked();
    await user.click(screen.getByRole('button', { name: '送信' }));

    await waitFor(() => {
      expect(onSubmitAnswers).toHaveBeenCalledTimes(2);
    });
    expect(onSubmitAnswers).toHaveBeenNthCalledWith(2, {
      '8f98a37f-9070-4624-b161-f288769160d5': ['申請内容を確認したい'],
    });
  });

  it('同じラベルの選択肢が複数ある複数選択で、片方だけを選択できる', async () => {
    const user = userEvent.setup();
    const onSubmitAnswers = vi
      .fn<(data: AnswerFormInput) => Promise<{ ok: boolean }>>()
      .mockResolvedValue({ ok: true });

    const duplicateLabelQuestions: GetQuestionsResponse = [
      {
        id: '8f98a37f-9070-4624-b161-f288769160d5',
        template_key: 'consultation_topics',
        title: '相談したい内容',
        description: '',
        is_required: false,
        position: 1,
        question_type: 'MultipleChoice',
        choices: [
          { id: 1, label: 'その他', position: 1 },
          { id: 2, label: 'その他', position: 2 },
        ],
      },
    ];

    renderWithProviders(
      <AnswerSubmissionForm
        questions={duplicateLabelQuestions}
        title="お問い合わせ"
        description=""
        isTemporary={false}
        onSubmitAnswers={onSubmitAnswers}
      />
    );

    const [firstChoice, secondChoice] = screen.getAllByRole('checkbox', {
      name: 'その他',
    });
    if (!firstChoice || !secondChoice) {
      throw new Error(
        '「その他」のチェックボックスが2つ見つかりませんでした。'
      );
    }
    await user.click(firstChoice);

    expect(firstChoice).toBeChecked();
    expect(secondChoice).not.toBeChecked();

    await user.click(screen.getByRole('button', { name: '送信' }));

    await waitFor(() => {
      expect(onSubmitAnswers).toHaveBeenCalledWith({
        '8f98a37f-9070-4624-b161-f288769160d5': ['その他'],
      });
    });
  });

  it('単一選択の回答を未選択へ戻せる', async () => {
    const user = userEvent.setup();
    const onSubmitAnswers = vi
      .fn<(data: AnswerFormInput) => Promise<{ ok: boolean }>>()
      .mockResolvedValue({ ok: true });

    renderWithProviders(
      <AnswerSubmissionForm
        questions={singleChoiceQuestions}
        title="お問い合わせ"
        description=""
        isTemporary={false}
        onSubmitAnswers={onSubmitAnswers}
      />
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: '申請について' }));
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: '未選択' }));
    await user.click(screen.getByRole('button', { name: '送信' }));

    await waitFor(() => {
      expect(onSubmitAnswers).toHaveBeenCalledWith({
        '0c2a6f9a-28c2-4116-835b-fdd7289a16f1': '',
      });
    });
  });

  it('必須の単一選択が未選択の場合は送信しない', async () => {
    const user = userEvent.setup();
    const onSubmitAnswers = vi
      .fn<(data: AnswerFormInput) => Promise<{ ok: boolean }>>()
      .mockResolvedValue({ ok: true });

    renderWithProviders(
      <AnswerSubmissionForm
        questions={requiredSingleChoiceQuestions}
        title="お問い合わせ"
        description=""
        isTemporary={false}
        onSubmitAnswers={onSubmitAnswers}
      />
    );

    await user.click(screen.getByRole('button', { name: '送信' }));

    expect(await screen.findByText('選択してください。')).toBeVisible();
    expect(onSubmitAnswers).not.toHaveBeenCalled();
  });
});
