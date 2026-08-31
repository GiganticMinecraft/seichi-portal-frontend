import type {
  GetAnswerLabelsResponse,
  GetFormAnswersResponse,
} from '@/lib/api-types';
import { answerOpenState } from '@/lib/forms/answerStatus';
import type { AnswerOpenState } from '@/lib/forms/answerStatus';

export interface AnswerListFilter {
  labels: GetAnswerLabelsResponse;
  /** 既定は 'open'。'all' を指定すると対応状況による絞り込みをしない。 */
  openState: AnswerOpenState | 'all';
}

export const filterAnswers = (
  answers: GetFormAnswersResponse,
  filter: AnswerListFilter
): GetFormAnswersResponse =>
  answers
    .filter(
      (answer) =>
        filter.openState === 'all' ||
        answerOpenState(answer.status) === filter.openState
    )
    .filter((answer) =>
      filter.labels.every((label) =>
        answer.labels.some((answerLabel) => answerLabel.id === label.id)
      )
    );

/** DataGrid の noRows 表示に使う、現在の絞り込み状態に応じた案内文。 */
export const getAnswerListEmptyMessage = ({
  search,
  openState,
}: {
  search: string;
  openState: AnswerOpenState;
}): string => {
  if (search.trim() !== '') {
    return `「${search}」に一致する回答が見つかりませんでした`;
  }
  return openState === 'open'
    ? '未完了の回答はありません'
    : '完了した回答はありません';
};
