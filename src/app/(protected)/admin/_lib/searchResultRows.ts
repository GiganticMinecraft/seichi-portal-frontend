import {
  searchAnswerItemSchema,
  searchFormItemSchema,
  searchLabelItemSchema,
  searchUserItemSchema,
} from '@/lib/api-types';
import type { SearchResponse } from '@/lib/api-types';

export interface SearchResultRow {
  id: number;
  category:
    | 'フォーム'
    | '回答'
    | 'ユーザー'
    | 'フォーム用ラベル'
    | '回答用ラベル'
    | 'コメント';
  title: string;
  url: string;
}

type SearchResultRowWithoutId = Omit<SearchResultRow, 'id'>;

export const toSearchResultRows = (data: SearchResponse): SearchResultRow[] =>
  [
    data.forms.flatMap((form): SearchResultRowWithoutId[] => {
      const result = searchFormItemSchema.safeParse(form);
      return result.success
        ? [
            {
              category: 'フォーム',
              title: result.data.title,
              url: `/admin/forms/edit/${result.data.id}`,
            },
          ]
        : [];
    }),
    data.answers.flatMap((answer): SearchResultRowWithoutId[] => {
      const result = searchAnswerItemSchema.safeParse(answer);
      return result.success
        ? [
            {
              category: '回答',
              title: result.data.answer,
              url: `/admin/answer/${result.data.answer_id}`,
            },
          ]
        : [];
    }),
    data.users.flatMap((user): SearchResultRowWithoutId[] => {
      const result = searchUserItemSchema.safeParse(user);
      return result.success
        ? [
            {
              category: 'ユーザー',
              title: result.data.name,
              url: `/admin/users/`,
            },
          ]
        : [];
    }),
    data.label_for_forms.flatMap((label): SearchResultRowWithoutId[] => {
      const result = searchLabelItemSchema.safeParse(label);
      return result.success
        ? [
            {
              category: 'フォーム用ラベル',
              title: result.data.name,
              url: `/admin/labels?tab=forms`,
            },
          ]
        : [];
    }),
    data.label_for_answers.flatMap((label): SearchResultRowWithoutId[] => {
      const result = searchLabelItemSchema.safeParse(label);
      return result.success
        ? [
            {
              category: '回答用ラベル',
              title: result.data.name,
              url: `/admin/labels?tab=answers`,
            },
          ]
        : [];
    }),
    data.comments.map(
      (comment): SearchResultRowWithoutId => ({
        category: 'コメント',
        title: comment.content,
        url: `/admin/answer/${comment.answer_id}`,
      })
    ),
  ]
    .flat()
    .map((row, index) => ({ ...row, id: index }));
