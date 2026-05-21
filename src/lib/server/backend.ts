import createClient from 'openapi-fetch';
import { getBackendServerUrl } from '@/env.server';
import type { ApiPaths } from '@/lib/api/types';

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

type BackendFetchResult<T> = {
  data?: T;
  error?: unknown;
  response: Response;
};

export const createServerApiClient = () =>
  createClient<ApiPaths>({
    baseUrl: getBackendServerUrl(),
    cache: 'no-cache',
  });

export const serverApiClient = createServerApiClient();

export const authorizationHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const requireBackendData = async <T>(
  request: Promise<BackendFetchResult<T>>
): Promise<T> => {
  const { data } = await requireBackendResponse(request);

  if (data === undefined) {
    throw new BackendError({
      message: 'Backend request did not return a response body',
      status: 502,
      code: 'http_error',
    });
  }

  return data;
};

export const requireBackendResponse = async <T>(
  request: Promise<BackendFetchResult<T>>
): Promise<BackendFetchResult<T>> => {
  try {
    const result = await request;

    if (!result.response.ok) {
      throw new BackendError({
        message: `Backend request failed with status ${result.response.status}`,
        status: result.response.status,
        code: 'http_error',
      });
    }

    return result;
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
