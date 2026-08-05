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

  it('Webhook 無効化のチェックで URL 入力を無効にする', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <FormEditForm form={form} labelOptions={[]} groupOptions={[]} />
    );

    const webhookDisabled = screen.getByRole('checkbox', {
      name: 'Webhook 通知を無効化する(URL入力より優先されます)',
    });
    const webhookUrl = screen.getByRole('textbox', { name: 'Webhook URL' });

    expect(webhookDisabled).not.toBeChecked();
    expect(webhookUrl).not.toBeDisabled();

    await user.click(webhookDisabled);

    expect(webhookDisabled).toBeChecked();
    expect(webhookUrl).toBeDisabled();
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
});
