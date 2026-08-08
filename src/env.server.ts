import { z } from 'zod';

const backendServerUrlSchema = z.url();
const proxySecretSchema = z.string().trim().min(1).optional();
const headerNameSchema = z
  .string()
  .regex(/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/)
  .refine((value) =>
    ['x-forwarded-for', 'x-real-ip', 'cf-connecting-ip'].includes(
      value.toLowerCase()
    )
  )
  .optional();
const discordConfigSchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  redirectUri: z.url(),
});
const debugModeSchema = z.enum(['true', 'false']).default('false');

export const getBackendServerUrl = () =>
  backendServerUrlSchema.parse(process.env['BACKEND_SERVER_URL']);

export const getSeichiProxySecret = () => {
  const result = proxySecretSchema.safeParse(
    process.env['SEICHI_PROXY_SECRET'] || undefined
  );
  return result.success ? result.data : undefined;
};

export const getSeichiClientIpHeader = () => {
  const result = headerNameSchema.safeParse(
    process.env['SEICHI_CLIENT_IP_HEADER'] || undefined
  );
  return result.success ? result.data : undefined;
};

const ipv4Schema = z.ipv4();
const ipv6Schema = z.ipv6();

/**
 * Build the backend metadata headers from a server-owned request.
 *
 * The two x-seichi headers are always removed first so a browser cannot bring
 * its own secret or client address through the proxy. The configured ingress
 * header is trusted only as an input to the server-side mapping, and only a
 * single canonical IPv4/IPv6 value is accepted.
 */
export const getSeichiProxyHeaders = (
  requestHeaders: Pick<Headers, 'get'>
): Record<string, string> => {
  const secret = getSeichiProxySecret();
  const ingressHeader = getSeichiClientIpHeader();
  if (!secret) return {};

  const result: Record<string, string> = {
    'x-seichi-proxy-secret': secret,
  };

  if (ingressHeader) {
    const value = requestHeaders.get(ingressHeader)?.trim();
    const isIp =
      value !== undefined &&
      (ipv4Schema.safeParse(value).success ||
        ipv6Schema.safeParse(value).success);
    if (isIp) {
      result['x-seichi-client-ip'] = value;
    }
  }

  return result;
};

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
