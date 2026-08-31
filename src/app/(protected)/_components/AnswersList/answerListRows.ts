import { formatString } from '@/generic/DateFormatter';
import type {
  AnswerStatus,
  GetAnswerLabelsResponse,
  GetFormAnswersResponse,
} from '@/lib/api-types';
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

export type AnswerListRow = {
  id: string;
  title: string;
  /** 回答者本人が閲覧しておりフォームの設定で非表示にされている場合は undefined */
  date: string | undefined;
  labels: GetAnswerLabelsResponse | undefined;
  status: AnswerStatus | undefined;
};

export const toAnswerListRows = (
  answers: GetFormAnswersResponse
): AnswerListRow[] =>
  answers.map((answer) => ({
    id: answer.id,
    title: resolveAnswerTitle(answer.title),
    date:
      answer.timestamp !== undefined
        ? formatString(answer.timestamp)
        : undefined,
    labels: answer.labels,
    status: answer.status,
  }));
