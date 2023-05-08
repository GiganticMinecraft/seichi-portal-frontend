import { rewriteRules } from '@/generated/rewrites/out';

export type UserApiKey = keyof typeof rewriteRules;

export const overrides = rewriteRules;
