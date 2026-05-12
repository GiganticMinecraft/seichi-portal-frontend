import { getBackendServerUrl } from '@/env.server';

export class BackendError extends Error {
  status: number;
  code: 'http_error' | 'network_error';

  constructor({
    message,
    status,
    code,
  }: {
    message: string;
    status: number;
    code: 'http_error' | 'network_error';
  }) {
    super(message);
    this.name = 'BackendError';
    this.status = status;
    this.code = code;
  }
}

type BackendFetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: HeadersInit;
  token?: string;
};

const createUrl = (path: string) => {
  const backendServerUrl = getBackendServerUrl();
  return new URL(path, backendServerUrl).toString();
};

export const backendFetch = async (
  path: string,
  options: BackendFetchOptions = {}
) => {
  const { token, headers, cache = 'no-cache', ...init } = options;
  const requestHeaders = new Headers(headers);

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(createUrl(path), {
      ...init,
      headers: requestHeaders,
      cache,
    });

    if (!response.ok) {
      throw new BackendError({
        message: `Backend request failed with status ${response.status}`,
        status: response.status,
        code: 'http_error',
      });
    }

    return response;
  } catch (error) {
    if (error instanceof BackendError) {
      throw error;
    }

    throw new BackendError({
      message: 'Backend request failed due to a network error',
      status: 503,
      code: 'network_error',
    });
  }
};

export const backendFetchJson = async <T>(
  path: string,
  options: BackendFetchOptions = {}
): Promise<T> => {
  const response = await backendFetch(path, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  });

  return (await response.json()) as T;
};
