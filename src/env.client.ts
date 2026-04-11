import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_MS_APP_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_MS_APP_REDIRECT_URL: z.string().url(),
  NEXT_PUBLIC_DEBUG_MODE: z.enum(['true', 'false']).default('false'),
});

const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_MS_APP_CLIENT_ID: process.env.NEXT_PUBLIC_MS_APP_CLIENT_ID,
  NEXT_PUBLIC_MS_APP_REDIRECT_URL: process.env.NEXT_PUBLIC_MS_APP_REDIRECT_URL,
  NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE,
});

export const MS_APP_CLIENT_ID = clientEnv.NEXT_PUBLIC_MS_APP_CLIENT_ID;
export const MS_APP_REDIRECT_URL = clientEnv.NEXT_PUBLIC_MS_APP_REDIRECT_URL;
export const DEBUG_MODE = clientEnv.NEXT_PUBLIC_DEBUG_MODE === 'true';
