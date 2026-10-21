import { describe, expect, it, vi } from 'vitest';

import { createApiClient } from '@/lib/api/createApiClient';
import {
  BackendError,
  requireBackendDataOrNotFound,
  requireBackendResponse,
} from '@/lib/server/backend';

const { notFoundMock } = vi.hoisted(() => ({
  notFoundMock: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next/navigation', () => ({
  notFound: notFoundMock,
}));

const responseWithStatus = (status: number) => new Response(null, { status });

describe('requireBackendDataOrNotFound', () => {
  it('成功時はデータをそのまま返す', async () => {
    await expect(
      requireBackendDataOrNotFound(
        Promise.resolve({
          data: { id: 'form' },
          response: responseWithStatus(200),
        })
      )
    ).resolves.toEqual({ id: 'form' });
    expect(notFoundMock).not.toHaveBeenCalled();
  });

  it('backend が 404 を返したら notFound() に委ねる', async () => {
    await expect(
      requireBackendDataOrNotFound(
        Promise.resolve({
          error: { title: 'Not Found' },
          response: responseWithStatus(404),
        })
      )
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it('404 以外のエラーは BackendError のまま投げる', async () => {
    notFoundMock.mockClear();
    await expect(
      requireBackendDataOrNotFound(
        Promise.resolve({ error: undefined, response: responseWithStatus(503) })
      )
    ).rejects.toBeInstanceOf(BackendError);
    expect(notFoundMock).not.toHaveBeenCalled();
  });
});

describe('requireBackendResponse', () => {
  it('backend への fetch がタイムアウトしたら network_error (503) の BackendError にする', async () => {
    const timeout = new DOMException('timed out', 'TimeoutError');
    const error: unknown = await requireBackendResponse(
      Promise.reject(timeout)
    ).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BackendError);
    expect(error).toMatchObject({
      status: 503,
      code: 'network_error',
      cause: timeout,
    });
    expect(error instanceof Error ? error.message : '').toContain('timed out');
  });
});

describe('createApiClient', () => {
  it('2xx のボディ読み取り中に中断されたら成功扱いにせず reject し、network_error (503) になる', async () => {
    const timeout = new DOMException('timed out', 'TimeoutError');
    const client = createApiClient({
      baseUrl: 'http://backend.invalid',
      fetch: () =>
        Promise.resolve(
          new Response(
            new ReadableStream({
              start(controller) {
                controller.error(timeout);
              },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        ),
    });

    const error: unknown = await requireBackendResponse(
      client.get({ url: '/api/v1/forms' })
    ).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BackendError);
    expect(error).toMatchObject({ status: 503, code: 'network_error' });
  });

  it('HTTP エラーは従来どおり reject せず error に入れて返す', async () => {
    const client = createApiClient({
      baseUrl: 'http://backend.invalid',
      fetch: () =>
        Promise.resolve(
          new Response(JSON.stringify({ title: 'Not Found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          })
        ),
    });

    const result = await client.get({ url: '/api/v1/forms/x' });

    expect(result.response?.status).toBe(404);
    expect(result.error).toEqual({ title: 'Not Found' });
  });
});
