import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_DEBUG_MODE: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_APP_VERSION: z.string().min(1).optional(),
});

const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_DEBUG_MODE: process.env['NEXT_PUBLIC_DEBUG_MODE'],
  NEXT_PUBLIC_APP_VERSION: process.env['NEXT_PUBLIC_APP_VERSION'] || undefined,
});

export const DEBUG_MODE = clientEnv.NEXT_PUBLIC_DEBUG_MODE === 'true';

// Faro の app.version。リリース CI から build-arg で渡される（#934 の
// source map アップロードキーと一致させる）。
export const APP_VERSION = clientEnv.NEXT_PUBLIC_APP_VERSION;
