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
