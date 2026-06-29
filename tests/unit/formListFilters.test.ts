import { describe, expect, it } from 'vitest';

import { filterForms } from '@/app/(protected)/admin/forms/_lib/formListFilters';
import type { GetFormLabelsResponse, GetFormsResponse } from '@/lib/api-types';

const labels = {
  event: { id: 'label-event', name: 'イベント' },
  support: { id: 'label-support', name: 'サポート' },
  private: { id: 'label-private', name: '非公開' },
} satisfies Record<string, GetFormLabelsResponse[number]>;

const form = (
  id: string,
  title: string,
  formLabels: GetFormLabelsResponse
): GetFormsResponse[number] => ({
  description: '',
  id,
  labels: formLabels,
  metadata: {
    created_at: '2026-06-01T00:00:00+09:00',
    updated_at: '2026-06-01T00:00:00+09:00',
  },
  questions: [],
  settings: {
    allow_temporary_answers: false,
    answer_settings: {
      acceptance_period: {},
      visibility: 'PUBLIC',
    },
    discord_webhook_url: null,
    visibility: 'PUBLIC',
  },
  title,
});

const forms = [
  form('form-1', 'イベント参加申請', [labels.event, labels.support]),
  form('form-2', 'サポート問い合わせ', [labels.support]),
  form('form-3', 'Private Application', [labels.private]),
] satisfies GetFormsResponse;

describe('filterForms', () => {
  it('タイトル検索は前後空白と大文字小文字を無視して絞り込む', () => {
    const filtered = filterForms(forms, {
      titleSearch: '  private  ',
      labels: [],
    });

    expect(filtered.map((form) => form.id)).toEqual(['form-3']);
  });

  it('選択したラベルをすべて持つフォームだけを残す', () => {
    const filtered = filterForms(forms, {
      titleSearch: '',
      labels: [labels.event, labels.support],
    });

    expect(filtered.map((form) => form.id)).toEqual(['form-1']);
  });

  it('タイトル検索とラベル条件を同時に満たすフォームだけを残す', () => {
    const filtered = filterForms(forms, {
      titleSearch: 'サポート',
      labels: [labels.event],
    });

    expect(filtered.map((form) => form.id)).toEqual([]);
  });
});
