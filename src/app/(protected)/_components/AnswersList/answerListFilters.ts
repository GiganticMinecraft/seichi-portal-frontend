import type {
  AnswerStatus,
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

/** open/closed の二分類をバックエンドの AnswerStatus 群へ展開する。open は
 * UNADDRESSED/IN_PROGRESS の OR、closed は COMPLETED 単体。 */
export const OPEN_STATE_TO_ANSWER_STATUSES: Record<
  AnswerOpenState,
  AnswerStatus[]
> = {
  open: ['UNADDRESSED', 'IN_PROGRESS'],
  closed: ['COMPLETED'],
};

export const isAnswerOpenState = (
  value: string | undefined | null
): value is AnswerOpenState => value === 'open' || value === 'closed';

/** URL の status クエリ文字列から openState を決定する。未指定・不正値は 'open'。 */
export const resolveAnswerOpenState = (
  value: string | undefined | null
): AnswerOpenState => (isAnswerOpenState(value) ? value : 'open');

// status/labels は、回答者本人が RESTRICTED 設定のフォームで自分の回答を
// 見ているときは undefined になる(非公開)。絞り込み条件と比較できないため、
// status は無条件でマッチさせ、labels はラベル絞り込みが有効なときのみ除外する。
export const filterAnswers = (
  answers: GetFormAnswersResponse,
  filter: AnswerListFilter
): GetFormAnswersResponse =>
  answers
    .filter(
      (answer) =>
        filter.openState === 'all' ||
        answer.status === undefined ||
        answerOpenState(answer.status) === filter.openState
    )
    .filter(
      (answer) =>
        filter.labels.length === 0 ||
        (answer.labels !== undefined &&
          filter.labels.every((label) =>
            answer.labels?.some((answerLabel) => answerLabel.id === label.id)
          ))
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
