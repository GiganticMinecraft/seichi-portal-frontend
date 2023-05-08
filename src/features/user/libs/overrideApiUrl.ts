import { rewriteRules } from '@/generated/rewrites/out';
import { overrideUrl } from '@/libs/overrideUrl';

import { UserApiKey } from '../config/overrideUrl';

export const overrideApiUrl = (key: UserApiKey) =>
  overrideUrl(rewriteRules, key);
