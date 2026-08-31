import { formatString } from '@/generic/DateFormatter';
import type {
  AnswerStatus,
  GetAnswerLabelsResponse,
  GetAnswersResponse,
} from '@/lib/api-types';
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

export type MyAnswerListRow = {
  id: string;
  formId: string;
  title: string;
  /** フォームの回答詳細公開設定 (RESTRICTED) により非表示にされている場合は undefined */
  date: string | undefined;
  labels: GetAnswerLabelsResponse | undefined;
  status: AnswerStatus | undefined;
};

export const toMyAnswerListRows = (
  answers: GetAnswersResponse
): MyAnswerListRow[] =>
  answers.map((answer) => ({
    id: answer.id,
    formId: answer.form_id,
    title: resolveAnswerTitle(answer.title),
    date:
      answer.timestamp !== undefined
        ? formatString(answer.timestamp)
        : undefined,
    labels: answer.labels,
    status: answer.status,
  }));
