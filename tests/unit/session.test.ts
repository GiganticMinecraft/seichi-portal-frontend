import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AccessError } from '@/lib/accessError';
import { BackendError } from '@/lib/server/backend';
import { normalizeRedirectTarget } from '@/lib/redirect';

const redirectMock = vi.fn<(url: string) => never>();
const headersMock = vi.fn(async () => new Headers());
const getCachedTokenMock = vi.fn();
const backendFetchMock = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (url: string) => redirectMock(url),
}));

vi.mock('next/headers', () => ({
  headers: () => headersMock(),
}));

vi.mock('@/user-token/mcToken', () => ({
  getCachedToken: (...args: unknown[]) => getCachedTokenMock(...args),
}));

vi.mock('@/lib/server/backend', async () => {
  const actual = await vi.importActual<typeof import('@/lib/server/backend')>(
    '@/lib/server/backend'
  );

  return {
    ...actual,
    backendFetch: (...args: unknown[]) => backendFetchMock(...args),
  };
});

const loadSessionModule = async () => import('@/lib/server/session');

describe('normalizeRedirectTarget', () => {
  it('内部パスは許可する', () => {
    expect(normalizeRedirectTarget('/forms')).toBe('/forms');
  });

  it('外部 URL のようなパスは拒否する', () => {
    expect(normalizeRedirectTarget('//evil.example')).toBe('/');
    expect(normalizeRedirectTarget('https://evil.example')).toBe('/');
  });
});

describe('server session helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    redirectMock.mockImplementation((url) => {
      throw new Error(`redirect:${url}`);
    });
  });

  it('セッション Cookie がない場合は未認証を返す', async () => {
    getCachedTokenMock.mockResolvedValue(undefined);
    const { getSession } = await loadSessionModule();

    await expect(getSession()).resolves.toEqual({ state: 'unauthenticated' });
  });

  it('バックエンドのユーザー取得に成功した場合は認証済みを返す', async () => {
    getCachedTokenMock.mockResolvedValue('token-123');
    backendFetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'user-id',
          name: 'Alice',
          role: 'ADMINISTRATOR',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
    const { getSession } = await loadSessionModule();

    await expect(getSession()).resolves.toEqual({
      state: 'authenticated',
      token: 'token-123',
      user: {
        id: 'user-id',
        name: 'Alice',
        role: 'ADMINISTRATOR',
      },
    });
  });

  it('バックエンドのレスポンスボディが不正な場合は unavailable を返す', async () => {
    getCachedTokenMock.mockResolvedValue('token-123');
    backendFetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id: 'user-id' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    const { getSession } = await loadSessionModule();

    await expect(getSession()).resolves.toEqual({
      state: 'unavailable',
      reason: 'invalid_response',
      status: 502,
    });
  });

  it('未認証アクセス時は現在のパス付きでログイン画面へリダイレクトする', async () => {
    getCachedTokenMock.mockResolvedValue(undefined);
    headersMock.mockResolvedValue(
      new Headers({ 'x-current-path': '/admin?tab=users' })
    );
    const { requireUser } = await loadSessionModule();

    await expect(requireUser()).rejects.toThrow(
      'redirect:/login?redirectTo=%2Fadmin%3Ftab%3Dusers'
    );
  });

  it('認証済みでも管理者でない場合は forbidden を送出する', async () => {
    getCachedTokenMock.mockResolvedValue('token-123');
    backendFetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'user-id',
          name: 'Alice',
          role: 'STANDARD_USER',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
    const { requireAdmin } = await loadSessionModule();

    await expect(requireAdmin()).rejects.toEqual(
      expect.objectContaining<Partial<AccessError>>({
        name: 'AccessError',
        status: 403,
        code: 'FORBIDDEN',
      })
    );
  });

  it('バックエンドに到達できない場合は unavailable を返す', async () => {
    getCachedTokenMock.mockResolvedValue('token-123');
    backendFetchMock.mockRejectedValue(
      new BackendError({
        message: 'backend unavailable',
        status: 503,
        code: 'network_error',
      })
    );
    const { getSession } = await loadSessionModule();

    await expect(getSession()).resolves.toEqual({
      state: 'unavailable',
      reason: 'backend_unavailable',
      status: 503,
    });
  });
});
