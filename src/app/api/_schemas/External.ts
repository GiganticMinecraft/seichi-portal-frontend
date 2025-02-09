import { z } from 'zod';

export const discordTokenSchema = z.object({
  access_token: z.string(),
});
