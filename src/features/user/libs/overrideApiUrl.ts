import { RewriteRuleKeys, rewriteRules } from '@/generated/rewrites/out';
import { overrideUrl } from '@/libs/overrideUrl';

export const overrideApiUrl = (key: RewriteRuleKeys) =>
  overrideUrl(rewriteRules, key);
