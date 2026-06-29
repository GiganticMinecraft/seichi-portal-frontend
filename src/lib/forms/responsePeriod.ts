import { formatString } from '@/generic/DateFormatter';
import type { ApiComponents } from '@/lib/api/types';

type AnswerAcceptancePeriod =
  ApiComponents['schemas']['AnswerAcceptancePeriodSchema'];

export type ResponsePeriod =
  | { kind: 'none' }
  | { kind: 'startsAt'; startAt: string }
  | { kind: 'endsAt'; endAt: string }
  | { kind: 'specified'; startAt: string; endAt: string };

export const toResponsePeriod = (
  acceptancePeriod: AnswerAcceptancePeriod | null | undefined
): ResponsePeriod => {
  const startAt = acceptancePeriod?.start_at;
  const endAt = acceptancePeriod?.end_at;

  if (startAt && endAt) {
    return { kind: 'specified', startAt, endAt };
  }
  if (startAt) {
    return { kind: 'startsAt', startAt };
  }
  if (endAt) {
    return { kind: 'endsAt', endAt };
  }
  return { kind: 'none' };
};

export const formatResponsePeriod = (responsePeriod: ResponsePeriod) => {
  switch (responsePeriod.kind) {
    case 'specified':
      return `${formatString(responsePeriod.startAt)} ~ ${formatString(
        responsePeriod.endAt
      )}`;
    case 'startsAt':
      return `${formatString(responsePeriod.startAt)} ~`;
    case 'endsAt':
      return `~ ${formatString(responsePeriod.endAt)}`;
    case 'none':
      return '回答期限なし';
  }
};
