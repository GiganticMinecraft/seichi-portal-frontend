import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_DEBUG_MODE: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),
});

const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_DEBUG_MODE: process.env['NEXT_PUBLIC_DEBUG_MODE'],
  NEXT_PUBLIC_SENTRY_DSN: process.env['NEXT_PUBLIC_SENTRY_DSN'] || undefined,
});

export const DEBUG_MODE = clientEnv.NEXT_PUBLIC_DEBUG_MODE === 'true';

export const SENTRY_DSN = clientEnv.NEXT_PUBLIC_SENTRY_DSN;
