import { formatString } from '@/generic/DateFormatter';
import type { GetFormAnswersResponse } from '@/lib/api-types';

export type AnswerListRow = {
  id: string;
  title: string | null | undefined;
  date: string;
};

export const toAnswerListRows = (
  answers: GetFormAnswersResponse
): AnswerListRow[] =>
  answers.map((answer) => ({
    id: answer.id,
    title: answer.title,
    date: formatString(answer.timestamp),
  }));
