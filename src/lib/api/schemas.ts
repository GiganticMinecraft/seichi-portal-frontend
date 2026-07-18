import { z } from 'zod';

export const userInfoResponseSchema = z.object({
  discord_user_id: z.string().nullable().optional(),
  discord_username: z.string().nullable().optional(),
  id: z.string(),
  name: z.string(),
  role: z.string(),
});
