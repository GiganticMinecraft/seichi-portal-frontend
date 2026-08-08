export type HttpErrorOptions = {
  message: string;
  status: number;
  url: string;
  body?: unknown;
  headers?: Headers;
};

const parseDeltaSeconds = (value: string | null): number | undefined => {
  if (value === null || !/^\d+$/.test(value.trim())) return undefined;

  const seconds = Number(value.trim());
  return Number.isSafeInteger(seconds) ? seconds : undefined;
};

export const getRetryAfterSeconds = (headers: Pick<Headers, 'get'>) =>
  parseDeltaSeconds(headers.get('Retry-After'));

export const getRateLimitResetSeconds = (headers: Pick<Headers, 'get'>) =>
  parseDeltaSeconds(headers.get('RateLimit-Reset'));

export const getProblemDetails = (
  body: unknown
): { errorCode: string | undefined; detail: string | undefined } => {
  if (!isRecord(body)) {
    return { errorCode: undefined, detail: undefined };
  }

  return {
    errorCode:
      typeof body['errorCode'] === 'string' ? body['errorCode'] : undefined,
    detail: typeof body['detail'] === 'string' ? body['detail'] : undefined,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export class HttpError extends Error {
  status: number;
  url: string;
  body: unknown;
  headers: Headers;
  errorCode: string | undefined;
  detail: string | undefined;
  retryAfter: number | undefined;
  rateLimitReset: number | undefined;

  constructor({ message, status, url, body, headers }: HttpErrorOptions) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.url = url;
    this.body = body;
    this.headers = headers ?? new Headers();
    this.retryAfter = getRetryAfterSeconds(this.headers);
    this.rateLimitReset = getRateLimitResetSeconds(this.headers);

    const problemDetails = getProblemDetails(body);
    this.errorCode = problemDetails.errorCode;
    this.detail = problemDetails.detail;
  }
}

export const isHttpError = (error: unknown): error is HttpError =>
  error instanceof HttpError;
