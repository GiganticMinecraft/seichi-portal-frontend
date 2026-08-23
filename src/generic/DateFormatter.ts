import dayjs, { extend, locale } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import 'dayjs/locale/ja';

extend(timezone);
extend(utc);
extend(relativeTime);
dayjs.tz.setDefault('Asia/Tokyo');
locale('ja');

export const formatString = (date: string) => {
  const formatString = 'YYYY年MM月DD日 HH時mm分';

  return dayjs(new Date(date)).tz('Asia/Tokyo').format(formatString);
};

export const fromStringToJSTDateTime = (date: string) => {
  const formatString = 'YYYY-MM-DDTHH:mm';

  return dayjs(new Date(date)).tz('Asia/Tokyo').format(formatString);
};

export const toApiDateTime = (dateStr: string): string =>
  dayjs.tz(dateStr, 'Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ');

export const fromNow = (date: string): string =>
  dayjs(new Date(date)).tz('Asia/Tokyo').fromNow();
