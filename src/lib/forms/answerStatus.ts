import type { AnswerStatus } from '@/lib/api-types';

export const ANSWER_STATUS_LABEL: Record<AnswerStatus, string> = {
  UNADDRESSED: '未対応',
  IN_PROGRESS: '対応中',
  COMPLETED: '対応済み',
};

export const ANSWER_STATUS_COLOR: Record<
  AnswerStatus,
  'default' | 'info' | 'success'
> = {
  UNADDRESSED: 'default',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
};

/** GitHub Issue の Open/Closed に相当する二分類。UNADDRESSED/IN_PROGRESS を Open、
 * COMPLETED を Closed とみなす。 */
export type AnswerOpenState = 'open' | 'closed';

export const answerOpenState = (status: AnswerStatus): AnswerOpenState =>
  status === 'COMPLETED' ? 'closed' : 'open';
