import type { ChipProps } from '@mui/material';

import type { SearchResponse } from '@/lib/api-types';
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

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

export const SEARCH_RESULT_CATEGORY_COLOR: Record<
  SearchResultRow['category'],
  ChipProps['color']
> = {
  フォーム: 'primary',
  回答: 'secondary',
  ユーザー: 'success',
  フォーム用ラベル: 'info',
  回答用ラベル: 'info',
  コメント: 'warning',
};

type SearchResultRowWithoutId = Omit<SearchResultRow, 'id'>;

export const toSearchResultRows = (data: SearchResponse): SearchResultRow[] =>
  [
    data.forms.map(
      (form): SearchResultRowWithoutId => ({
        category: 'フォーム',
        title: form.title,
        url: `/admin/forms/edit/${form.id}`,
      })
    ),
    data.answers.map(
      (answer): SearchResultRowWithoutId => ({
        category: '回答',
        title: resolveAnswerTitle(answer.title),
        url: `/admin/answer/${answer.id}`,
      })
    ),
    data.users.map(
      (user): SearchResultRowWithoutId => ({
        category: 'ユーザー',
        title: user.name,
        url: `/admin/users?userId=${user.id}&userName=${encodeURIComponent(user.name)}`,
      })
    ),
    data.label_for_forms.map(
      (label): SearchResultRowWithoutId => ({
        category: 'フォーム用ラベル',
        title: label.name,
        url: `/admin/labels?tab=forms`,
      })
    ),
    data.label_for_answers.map(
      (label): SearchResultRowWithoutId => ({
        category: '回答用ラベル',
        title: label.name,
        url: `/admin/labels?tab=answers`,
      })
    ),
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
