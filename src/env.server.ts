import { z } from 'zod';

const backendServerUrlSchema = z.string().url();
const discordConfigSchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  redirectUri: z.string().url(),
});
const debugModeSchema = z.enum(['true', 'false']).default('false');

export const getBackendServerUrl = () =>
  backendServerUrlSchema.parse(process.env['BACKEND_SERVER_URL']);

export const getDiscordConfig = () =>
  discordConfigSchema.parse({
    clientId: process.env['DISCORD_CLIENT_ID'],
    clientSecret: process.env['DISCORD_CLIENT_SECRET'],
    redirectUri: process.env['DISCORD_REDIRECT_URI'],
  });

export const getDebugMode = () =>
  debugModeSchema.parse(process.env['NEXT_PUBLIC_DEBUG_MODE']) === 'true';
