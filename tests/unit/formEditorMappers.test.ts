import { describe, expect, it } from 'vitest';

import {
  fromFormResponseToEditorValues,
  toCreateFormBody,
  toFormUpdateBody,
} from '@/app/(protected)/admin/forms/_lib/formRequestBuilders';
import type {
  FormEditorQuestion,
  FormEditorValues,
} from '@/app/(protected)/admin/forms/_schema/formEditorSchema';
import type { GetFormResponse } from '@/lib/api-types';

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
    allowed_group_ids: [],
    answer_visibility: 'PUBLIC',
    answer_group_ids: [],
    allow_temporary_answers: false,
  },
};

const createFormResponse = (
  overrides: Partial<GetFormResponse> = {}
): GetFormResponse => ({
  id: 'form-id',
  title: 'Form title',
  description: 'Form description',
  labels: [],
  metadata: {
    created_at: '2026-06-01T00:00:00+09:00',
    updated_at: '2026-06-01T00:00:00+09:00',
  },
  settings: {
    visibility: 'PUBLIC',
    allowed_group_ids: [],
    allow_temporary_answers: false,
    discord_webhook_url: null,
    answer_settings: {
      default_answer_title: null,
      acceptance_period: {
        start_at: null,
        end_at: null,
      },
      visibility: 'PUBLIC',
      answer_group_ids: [],
    },
  },
  questions: [
    {
      id: 'question-id',
      title: 'Question title',
      description: null,
      question_type: 'SingleChoice',
      choices: [{ id: 1, label: 'First choice', position: 0 }],
      is_required: false,
      position: 0,
      template_key: 'question_1',
    },
  ],
  ...overrides,
});

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

  it('既存選択肢の ID を API の選択肢 ID へ変換する', () => {
    const body = toFormUpdateBody(
      {
        ...baseValues,
        questions: [
          {
            ...baseQuestion,
            question_type: 'SingleChoice',
            choices: [
              { id: 1, choice: ' First choice ' },
              { choice: 'New choice' },
            ],
          },
        ],
      },
      true
    );

    expect(body.questions?.[0]).toMatchObject({
      question_type: 'SingleChoice',
      choices: [
        { id: 1, label: 'First choice', position: 0 },
        { id: null, label: 'New choice', position: 1 },
      ],
    });
  });

  it('フォーム取得レスポンスの選択肢 ID を画面内部表現へ保持する', () => {
    const values = fromFormResponseToEditorValues(createFormResponse());

    expect(values.questions[0]?.choices[0]?.id).toBe(1);
  });

  it('回答期間が未設定のフォーム取得レスポンスを画面内部表現へ変換する', () => {
    const values = fromFormResponseToEditorValues(createFormResponse());

    expect(values.settings.acceptance_period).toEqual({ kind: 'none' });
  });

  it('回答期間が設定されたフォーム取得レスポンスを画面内部表現へ変換する', () => {
    const values = fromFormResponseToEditorValues(
      createFormResponse({
        settings: {
          ...createFormResponse().settings,
          answer_settings: {
            ...createFormResponse().settings.answer_settings,
            acceptance_period: {
              start_at: '2026-06-01T10:00:00+09:00',
              end_at: '2026-06-30T23:59:00+09:00',
            },
          },
        },
      })
    );

    expect(values.settings.acceptance_period).toEqual({
      kind: 'specified',
      startAt: '2026-06-01T10:00',
      endAt: '2026-06-30T23:59',
    });
  });

  it('片方だけ欠けた回答期間は画面内部表現へ変換しない', () => {
    const form = createFormResponse({
      settings: {
        ...createFormResponse().settings,
        answer_settings: {
          ...createFormResponse().settings.answer_settings,
          acceptance_period: {
            start_at: '2026-06-01T10:00:00+09:00',
            end_at: null,
          },
        },
      },
    });

    expect(() => fromFormResponseToEditorValues(form)).toThrow(
      'Answer acceptance period must have both start_at and end_at'
    );
  });

  it('未知の公開設定は画面内部表現へ変換しない', () => {
    const form = createFormResponse({
      settings: {
        ...createFormResponse().settings,
        visibility: 'UNKNOWN',
      },
    });

    expect(() => fromFormResponseToEditorValues(form)).toThrow();
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
