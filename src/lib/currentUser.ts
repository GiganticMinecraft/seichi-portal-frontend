import { z } from 'zod';
import { userInfoResponseSchema } from '@/lib/api/schemas';

export type CurrentUser = z.infer<typeof userInfoResponseSchema>;
