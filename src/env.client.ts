import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_DEBUG_MODE: z.enum(['true', 'false']).default('false'),
});

const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_DEBUG_MODE: process.env['NEXT_PUBLIC_DEBUG_MODE'],
});

export const DEBUG_MODE = clientEnv.NEXT_PUBLIC_DEBUG_MODE === 'true';
