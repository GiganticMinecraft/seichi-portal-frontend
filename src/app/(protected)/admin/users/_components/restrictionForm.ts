import { isDayjs } from 'dayjs';
import { z } from 'zod';
import type { Dayjs } from 'dayjs';
import type { PutAnswerSubmitterRestrictionSchema } from '@/lib/api-types';

export const restrictionFormSchema = z.object({
  reason: z.string().trim().min(1, '理由を入力してください'),
  // 有効期限は任意。未指定なら無期限の制限になる。
  // 指定時は有効な Dayjs であることを保証し、Invalid Date が API に渡らないようにする。
  expiresAt: z
    .custom<Dayjs>((val) => isDayjs(val) && val.isValid(), {
      message: '有効な日時を入力してください',
    })
    .nullable(),
});

export type RestrictionFormInput = z.input<typeof restrictionFormSchema>;
export type RestrictionFormValues = z.output<typeof restrictionFormSchema>;

/**
 * フォーム入力を PUT リクエストの body に変換する。
 * expires_at は未指定なら送らず、指定時のみ ISO 8601（タイムゾーン付き）にする。
 */
export const toRestrictionRequest = (
  values: RestrictionFormValues
): PutAnswerSubmitterRestrictionSchema => ({
  reason: values.reason.trim(),
  ...(values.expiresAt ? { expires_at: values.expiresAt.format() } : {}),
});
