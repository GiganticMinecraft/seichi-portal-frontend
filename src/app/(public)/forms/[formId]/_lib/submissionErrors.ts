import { errorResponseSchema } from '@/lib/api/errors';
import type { ErrorRestriction } from '@/lib/api/errors';
import { toRestrictionExpiration } from '@/lib/restrictions/expiration';
import type { RestrictionExpiration } from '@/lib/restrictions/expiration';

export type SubmissionErrorCode = 'OUT_OF_PERIOD' | 'RESTRICTED' | 'UNKNOWN';

export type SubmissionRestriction = {
  reason: string;
  expiration: RestrictionExpiration;
};

export type SubmissionError =
  | { kind: 'outOfPeriod' }
  | { kind: 'restricted'; restriction?: SubmissionRestriction }
  | { kind: 'unknown' };

type ParsedSubmissionError = {
  code: SubmissionErrorCode;
  restriction?: SubmissionRestriction;
};

const toSubmissionRestriction = (
  restriction: ErrorRestriction
): SubmissionRestriction => ({
  reason: restriction.reason,
  expiration: toRestrictionExpiration(restriction.expires_at),
});

export const parseSubmissionError = (
  error: unknown
): ParsedSubmissionError | null => {
  const parsed = errorResponseSchema.safeParse(error);

  if (!parsed.success) {
    return null;
  }

  if (parsed.data.errorCode === 'ANSWER_SUBMISSION_RESTRICTED') {
    return {
      code: 'RESTRICTED',
      ...(parsed.data.restriction
        ? { restriction: toSubmissionRestriction(parsed.data.restriction) }
        : {}),
    };
  }

  if (parsed.data.errorCode === 'OUT_OF_PERIOD') {
    return { code: 'OUT_OF_PERIOD' };
  }

  return null;
};
