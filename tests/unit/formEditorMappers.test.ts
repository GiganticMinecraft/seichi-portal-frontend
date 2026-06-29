import { describe, expect, it } from 'vitest';

import {
  toCreateFormBody,
  toFormUpdateBody,
} from '@/app/(protected)/admin/forms/_lib/formRequestBuilders';
import type {
  FormEditorQuestion,
  FormEditorValues,
} from '@/app/(protected)/admin/forms/_schema/formEditorSchema';

const baseQuestion: FormEditorQuestion = {
  identity: { kind: 'new' },
  title: ' Question title ',
  description: '',
  question_type: 'Text',
  choices: [],
  is_required: false,
  position: 0,
  template_key: '',
};

const baseValues: FormEditorValues = {
  title: ' Form title ',
  description: 'Form description',
  labels: [],
  questions: [baseQuestion],
  settings: {
    acceptance_period: { kind: 'none' },
    discord_webhook_url: '',
    default_answer_title: '',
    visibility: 'PUBLIC',
    answer_visibility: 'PUBLIC',
    allow_temporary_answers: false,
  },
};

describe('form request builders', () => {
  it('空のテンプレートキーと質問説明を API が受け付ける値へ正規化する', () => {
    const body = toCreateFormBody(baseValues);

    expect(body.title).toBe('Form title');
    expect(body.questions[0]).toMatchObject({
      title: 'Question title',
      description: null,
      question_type: 'Text',
      template_key: 'question_1',
    });
  });

  it('フォーム更新時も質問定義の空値を正規化する', () => {
    const body = toFormUpdateBody(baseValues, true);

    expect(body.questions?.[0]).toMatchObject({
      id: null,
      description: null,
      template_key: 'question_1',
    });
  });

  it('既存質問の画面内部表現を API の質問 ID へ変換する', () => {
    const body = toFormUpdateBody(
      {
        ...baseValues,
        questions: [
          {
            ...baseQuestion,
            identity: { kind: 'existing', id: 'question-id' },
          },
        ],
      },
      true
    );

    expect(body.questions?.[0]?.id).toBe('question-id');
  });

  it('空の Webhook URL は null に正規化する', () => {
    const body = toFormUpdateBody(
      {
        ...baseValues,
        settings: {
          ...baseValues.settings,
          discord_webhook_url: '',
        },
      },
      false
    );

    expect(body.settings?.discord_webhook_url).toBeNull();
  });

  it('空のデフォルト回答タイトルは null に正規化する', () => {
    const body = toFormUpdateBody(
      {
        ...baseValues,
        settings: {
          ...baseValues.settings,
          default_answer_title: '',
        },
      },
      false
    );

    expect(body.settings?.answer_settings.default_answer_title).toBeNull();
  });

  it('未ログイン回答の許可設定を更新ボディへ反映する', () => {
    const body = toFormUpdateBody(
      {
        ...baseValues,
        settings: {
          ...baseValues.settings,
          allow_temporary_answers: true,
        },
      },
      false
    );

    expect(body.settings?.allow_temporary_answers).toBe(true);
  });

  it('回答期間の画面内部表現を API の日時フィールドへ変換する', () => {
    const body = toFormUpdateBody(
      {
        ...baseValues,
        settings: {
          ...baseValues.settings,
          acceptance_period: {
            kind: 'specified',
            startAt: '2026-06-01T10:00',
            endAt: '2026-06-30T23:59',
          },
        },
      },
      false
    );

    expect(body.settings?.answer_settings.acceptance_period).toMatchObject({
      start_at: '2026-06-01T10:00:00+09:00',
      end_at: '2026-06-30T23:59:00+09:00',
    });
  });
});
