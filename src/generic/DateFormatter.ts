import dayjs, { extend } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

extend(timezone);
extend(utc);
dayjs.tz.setDefault('Asia/Tokyo');

export const formatString = (date: string) => {
  const formatString = 'YYYY年MM月DD日 HH時mm分';

  return dayjs(new Date(date)).tz('Asia/Tokyo').format(formatString);
};

export const fromStringToJSTDateTime = (date: string) => {
  const formatString = 'YYYY-MM-DDTHH:mm';

  return dayjs(new Date(date)).tz('Asia/Tokyo').format(formatString);
};

export const formatAcceptancePeriod = (
  period:
    | { start_at?: string | null; end_at?: string | null }
    | null
    | undefined
): string => {
  const startAt = period?.start_at;
  const endAt = period?.end_at;

  if (startAt && endAt) {
    return `${formatString(startAt)} ~ ${formatString(endAt)}`;
  }
  if (startAt) {
    return `${formatString(startAt)} ~`;
  }
  if (endAt) {
    return `~ ${formatString(endAt)}`;
  }
  return '回答期限なし';
};

export const toApiDateTime = (
  dateStr: string | null | undefined
): string | null => {
  if (!dateStr) return null;

  return dayjs.tz(dateStr, 'Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ');
};
