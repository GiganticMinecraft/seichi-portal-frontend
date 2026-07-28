import { formatString } from '@/generic/DateFormatter';
import type {
  GetAnswerLabelsResponse,
  GetFormAnswersResponse,
} from '@/lib/api-types';
import { resolveAnswerTitle } from '@/lib/forms/answerTitle';

export type AnswerListRow = {
  id: string;
  title: string;
  date: string;
  labels: GetAnswerLabelsResponse;
};

export const toAnswerListRows = (
  answers: GetFormAnswersResponse
): AnswerListRow[] =>
  answers.map((answer) => ({
    id: answer.id,
    title: resolveAnswerTitle(answer.title),
    date: formatString(answer.timestamp),
    labels: answer.labels,
  }));
