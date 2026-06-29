import { isDayjs } from 'dayjs';
import { z } from 'zod';
import type { Dayjs } from 'dayjs';
import type { PutAnswerSubmitterRestrictionSchema } from '@/lib/api-types';

const restrictionExpirationSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('indefinite') }),
  z.object({
    kind: z.literal('expiresAt'),
    expiresAt: z.custom<Dayjs>((val) => isDayjs(val) && val.isValid(), {
      message: '有効な日時を入力してください',
    }),
  }),
]);

export type RestrictionFormExpiration = z.infer<
  typeof restrictionExpirationSchema
>;

export const restrictionFormSchema = z.object({
  reason: z.string().trim().min(1, '理由を入力してください'),
  expiration: restrictionExpirationSchema,
});

export type RestrictionFormInput = z.input<typeof restrictionFormSchema>;
export type RestrictionFormValues = z.output<typeof restrictionFormSchema>;

/**
 * フォーム入力を PUT リクエストの body に変換する。
 * expires_at は未指定なら送らず、指定時のみ ISO 8601（タイムゾーン付き）にする。
 */
export const toRestrictionRequest = (
  values: RestrictionFormValues
): PutAnswerSubmitterRestrictionSchema => {
  const request: PutAnswerSubmitterRestrictionSchema = {
    reason: values.reason.trim(),
  };

  if (values.expiration.kind === 'expiresAt') {
    request.expires_at = values.expiration.expiresAt.format();
  }

  return request;
};
