import { describe, expect, it, vi } from 'vitest';

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
