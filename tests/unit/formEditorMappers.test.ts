import { describe, expect, it } from 'vitest';
import {
  toCreateFormBody,
  toFormUpdateBody,
} from '@/app/(authed)/admin/forms/_lib/formRequestBuilders';
import type { FormEditorValues } from '@/app/(authed)/admin/forms/_schema/formEditorSchema';

const baseValues: FormEditorValues = {
  title: ' Form title ',
  description: 'Form description',
  labels: [],
  questions: [
    {
      id: null,
      title: ' Question title ',
      description: '',
      question_type: 'Text',
      choices: [],
      is_required: false,
      position: 0,
      template_key: '',
    },
  ],
  settings: {
    has_response_period: false,
    response_period: {
      start_at: null,
      end_at: null,
    },
    webhook_url: null,
    default_answer_title: null,
    visibility: 'PUBLIC',
    answer_visibility: 'PUBLIC',
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
      description: null,
      template_key: 'question_1',
    });
  });

  it('空の Webhook URL は null に正規化する', () => {
    const body = toFormUpdateBody(
      {
        ...baseValues,
        settings: {
          ...baseValues.settings,
          webhook_url: '',
        },
      },
      false
    );

    expect(body.settings?.webhook_url).toBeNull();
  });
});
