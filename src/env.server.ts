import { z } from 'zod';

const serverEnvSchema = z.object({
  BACKEND_SERVER_URL: z.string().url(),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  DISCORD_REDIRECT_URI: z.string().url(),
  NEXT_PUBLIC_DEBUG_MODE: z.enum(['true', 'false']).default('false'),
});

const serverEnv = serverEnvSchema.parse({
  BACKEND_SERVER_URL: process.env.BACKEND_SERVER_URL,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,
  NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE,
});

export const BACKEND_SERVER_URL = serverEnv.BACKEND_SERVER_URL;
export const DISCORD_CLIENT_ID = serverEnv.DISCORD_CLIENT_ID;
export const DISCORD_CLIENT_SECRET = serverEnv.DISCORD_CLIENT_SECRET;
export const DISCORD_REDIRECT_URI = serverEnv.DISCORD_REDIRECT_URI;
export const DEBUG_MODE = serverEnv.NEXT_PUBLIC_DEBUG_MODE === 'true';
