import { overrideUrl } from '@/libs/overrideUrl';

import { overrides, UserApiKey } from '../config/overrideUrl';

export const overrideApiUrl = (key: UserApiKey) => overrideUrl(overrides, key);
