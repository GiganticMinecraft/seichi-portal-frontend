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
