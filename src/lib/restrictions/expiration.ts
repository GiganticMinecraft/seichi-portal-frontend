import { formatString } from '@/generic/DateFormatter';

export type RestrictionExpiration =
  | { kind: 'indefinite' }
  | { kind: 'expiresAt'; expiresAt: string };

export const toRestrictionExpiration = (
  expiresAt: string | null | undefined
): RestrictionExpiration =>
  expiresAt ? { kind: 'expiresAt', expiresAt } : { kind: 'indefinite' };

export const formatRestrictionExpiration = (
  expiration: RestrictionExpiration
): string => {
  switch (expiration.kind) {
    case 'expiresAt':
      return formatString(expiration.expiresAt);
    case 'indefinite':
      return '無期限';
  }
};
