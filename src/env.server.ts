import { z } from 'zod';

const backendServerUrlSchema = z.url();
const discordConfigSchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  redirectUri: z.url(),
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

const otelExporterOtlpEndpointSchema = z.url().optional();
const otelSdkDisabledSchema = z.enum(['true', 'false']).default('false');

export const getOtelExporterOtlpEndpoint = () =>
  otelExporterOtlpEndpointSchema.parse(
    process.env['OTEL_EXPORTER_OTLP_ENDPOINT'] || undefined
  );

export const getOtelSdkDisabled = () =>
  otelSdkDisabledSchema.parse(process.env['OTEL_SDK_DISABLED'] || undefined) ===
  'true';

const pyroscopeServerAddressSchema = z.url().optional();

export const getPyroscopeServerAddress = () =>
  pyroscopeServerAddressSchema.parse(
    process.env['PYROSCOPE_SERVER_ADDRESS'] || undefined
  );

const msalRedirectUrlSchema = z.url().refine(
  (value) => {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  },
  { message: 'MS_APP_REDIRECT_URL must use http or https' }
);

const getMsalRedirectUrl = () =>
  msalRedirectUrlSchema.parse(process.env['MS_APP_REDIRECT_URL']);

const getOrigin = (url: string) => new URL(url).origin;

const msalConfigSchema = z.object({
  clientId: z.string().min(1),
  redirectUri: msalRedirectUrlSchema,
});

export const getMsalConfig = () =>
  msalConfigSchema.parse({
    clientId: process.env['MS_APP_CLIENT_ID'],
    redirectUri: getMsalRedirectUrl(),
  });

export const getMsalOrigin = () => getOrigin(getMsalRedirectUrl());
