import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import FormEditForm from '@/app/(protected)/admin/forms/edit/[id]/_components/FormEditForm';
import type { ApiPaths } from '@/lib/api/types';
import type { GetFormResponse } from '@/lib/api-types';

import { renderWithProviders, screen, waitFor } from './render';

type FormUpdateBody =
  ApiPaths['/api/v1/forms/{form_id}']['put']['requestBody']['content']['application/json'];

const { updateFormMock } = vi.hoisted(() => ({
  updateFormMock: vi
    .fn<(body: FormUpdateBody) => Promise<{ ok: boolean }>>()
    .mockResolvedValue({ ok: true }),
}));

vi.mock('@/hooks/useFormEditActions', () => ({
  useFormEditActions: () => ({ updateForm: updateFormMock }),
}));

const form: GetFormResponse = {
  id: 'form-id',
  title: 'フォームタイトル',
  description: 'フォームの説明',
  labels: [],
  metadata: {
    created_at: '2026-06-01T00:00:00+09:00',
    updated_at: '2026-06-01T00:00:00+09:00',
  },
  questions: [
    {
      id: 'question-id',
      title: '質問タイトル',
      description: null,
      question_type: 'Text',
      is_required: true,
      position: 0,
      template_key: 'question_1',
    },
  ],
  settings: {
    visibility: 'PUBLIC',
    allowed_group_ids: [],
    allow_temporary_answers: true,
    discord_webhook_enabled: false,
    answer_settings: {
      default_answer_title: null,
      acceptance_period: {
        start_at: null,
        end_at: null,
      },
      visibility: 'PUBLIC',
      answer_group_ids: [],
      hide_author: true,
    },
  },
};

const expectCheckedIcon = (label: string) => {
  const checkbox = screen.getByRole('checkbox', { name: label });

  expect(checkbox).toBeChecked();
  expect(
    checkbox.parentElement?.querySelector('[data-testid="CheckBoxIcon"]')
  ).not.toBeNull();
};

describe('FormEditForm', () => {
  beforeEach(() => {
    updateFormMock.mockClear();
  });

  it('取得した true の設定をチェック済みで表示する', () => {
    renderWithProviders(
      <FormEditForm form={form} labelOptions={[]} groupOptions={[]} />
    );

    expect(screen.getByText('未サインインユーザー')).toBeInTheDocument();
    expectCheckedIcon('回答者を隠して公開する');
    expectCheckedIcon('この質問への回答を必須にする');
  });

  it('Webhook 未設定時は変更ボタンのみ表示し、削除ボタンは表示しない', () => {
    renderWithProviders(
      <FormEditForm form={form} labelOptions={[]} groupOptions={[]} />
    );

    expect(screen.getByText('未設定')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '変更' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '削除' })
    ).not.toBeInTheDocument();
  });

  it('変更ボタンで URL 入力欄を開き、入力すると変更予定になり、キャンセルで閉じる', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <FormEditForm form={form} labelOptions={[]} groupOptions={[]} />
    );

    await user.click(screen.getByRole('button', { name: '変更' }));

    const webhookUrl = screen.getByRole('textbox', { name: 'Webhook URL' });
    await user.type(webhookUrl, 'https://example.com/webhook');

    expect(screen.getByText('変更予定')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'キャンセル' }));

    expect(
      screen.queryByRole('textbox', { name: 'Webhook URL' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('未設定')).toBeInTheDocument();
  });

  it('設定済みの Webhook で削除ボタンを押すと削除予定になり、取り消すボタンで元に戻る', async () => {
    const user = userEvent.setup();
    const enabledForm: GetFormResponse = {
      ...form,
      settings: { ...form.settings, discord_webhook_enabled: true },
    };

    renderWithProviders(
      <FormEditForm form={enabledForm} labelOptions={[]} groupOptions={[]} />
    );

    expect(screen.getByText('設定済み')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '削除' }));

    expect(screen.getByText('削除予定')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '取り消す' }));

    expect(screen.getByText('設定済み')).toBeInTheDocument();
  });

  it('取得した Checkbox の値を保存データへ反映する', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <FormEditForm form={form} labelOptions={[]} groupOptions={[]} />
    );

    await user.click(screen.getByRole('button', { name: '設定内容を保存' }));

    await waitFor(() => {
      expect(updateFormMock).toHaveBeenCalledTimes(1);
    });

    const updateFormBody = updateFormMock.mock.calls[0]?.[0];

    expect(updateFormBody?.questions?.[0]?.is_required).toBe(true);
    expect(updateFormBody?.settings?.allow_temporary_answers).toBe(true);
    expect(updateFormBody?.settings?.answer_settings?.hide_author).toBe(true);
  });

  it('必須項目が未入力のまま保存すると該当項目がエラー表示になる', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <FormEditForm form={form} labelOptions={[]} groupOptions={[]} />
    );

    const titleInput = screen.getByRole('textbox', {
      name: 'フォームタイトル',
    });
    await user.clear(titleInput);

    const questionTitleInput = screen.getByRole('textbox', {
      name: '質問タイトル',
    });
    await user.clear(questionTitleInput);

    await user.click(screen.getByRole('button', { name: '設定内容を保存' }));

    await waitFor(() => {
      expect(titleInput).toHaveAttribute('aria-invalid', 'true');
    });
    expect(questionTitleInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getAllByText('入力してください。').length).toBeGreaterThan(0);
    expect(updateFormMock).not.toHaveBeenCalled();
  });
});
