import { NextRequest } from 'next/server';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from 'vitest';

const { startSessionMock } = vi.hoisted(() => ({
  startSessionMock: vi.fn<(options: object) => Promise<unknown>>(),
}));

vi.mock('@/generated/api/sdk.gen', () => ({
  startSession: startSessionMock,
}));

vi.mock('@/lib/server/backend', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/server/backend')>()),
  serverApiClient: {},
}));

import { POST } from '@/app/api/minecraft-access-token/route';

const loginRequest = () =>
  new NextRequest('http://0.0.0.0:3000/api/minecraft-access-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: 'ms-token', turnstileToken: '' }),
  });

const xboxTokenResponse = () =>
  new Response(
    JSON.stringify({
      Token: 'xbl-token',
      DisplayClaims: { xui: [{ uhs: 'uhs' }] },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );

let consoleError: MockInstance<typeof console.error>;

beforeEach(() => {
  vi.clearAllMocks();
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  consoleError.mockRestore();
  vi.unstubAllGlobals();
});

describe('Minecraft access token route', () => {
  it.each([
    [0, 'xbox_user_auth'],
    [1, 'xbox_xsts'],
    [2, 'minecraft_login'],
  ])(
    '%i 番目の外部認証がタイムアウトしたら 504 / backend_unreachable を返し、%s を構造化ログに出す',
    async (timeoutAt, upstream) => {
      const timeout = new DOMException('timed out', 'TimeoutError');
      const fetchMock = vi.fn<typeof fetch>();
      for (let i = 0; i < timeoutAt; i++) {
        fetchMock.mockResolvedValueOnce(xboxTokenResponse());
      }
      fetchMock.mockRejectedValueOnce(timeout);
      vi.stubGlobal('fetch', fetchMock);

      const response = await POST(loginRequest());

      expect(response.status).toBe(504);
      await expect(response.json()).resolves.toMatchObject({
        code: 'backend_unreachable',
      });
      expect(fetchMock).toHaveBeenCalledTimes(timeoutAt + 1);
      for (const [, init] of fetchMock.mock.calls) {
        expect(init?.signal).toBeInstanceOf(AbortSignal);
      }
      expect(startSessionMock).not.toHaveBeenCalled();

      const log: unknown = JSON.parse(String(consoleError.mock.calls[0]?.[0]));
      expect(log).toMatchObject({
        msg: 'upstream request timed out',
        upstream,
        route: '/api/minecraft-access-token',
      });
    }
  );

  it('レスポンスボディの読み取り中にタイムアウトしても 504 にする', async () => {
    const timeout = new DOMException('timed out', 'TimeoutError');
    const stalledBody = new Response('{}', { status: 200 });
    vi.spyOn(stalledBody, 'json').mockRejectedValue(timeout);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(stalledBody));

    const response = await POST(loginRequest());

    expect(response.status).toBe(504);
  });

  it('backend の startSession がタイムアウトしたら 503 / backend_unreachable を返し、backend のタイムアウトとして構造化ログに出す', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValueOnce(xboxTokenResponse())
        .mockResolvedValueOnce(xboxTokenResponse())
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ access_token: 'mc-token', expires_in: 3600 }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        )
    );
    startSessionMock.mockRejectedValue(
      new DOMException('timed out', 'TimeoutError')
    );

    const response = await POST(loginRequest());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      code: 'backend_unreachable',
    });
    // 読み取り系より長い上限の fetch を SDK 呼び出しごとに渡している
    const [startSessionOptions] = startSessionMock.mock.calls[0] ?? [];
    expect(startSessionOptions).toHaveProperty('fetch');
    const log: unknown = JSON.parse(String(consoleError.mock.calls[0]?.[0]));
    expect(log).toMatchObject({
      msg: 'upstream request timed out',
      upstream: 'backend',
      route: '/api/minecraft-access-token',
    });
  });

  it('外部認証が失敗レスポンスを返したらボディを破棄して 502 / invalid_account', async () => {
    const failed = new Response('unauthorized', { status: 401 });
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(failed));

    const response = await POST(loginRequest());

    expect(response.status).toBe(502);
    expect(failed.bodyUsed).toBe(true);
  });

  it('外部認証が不正な JSON を返した場合は従来どおり 502 / invalid_account', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('not json', { status: 200 }))
    );

    const response = await POST(loginRequest());

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      code: 'invalid_account',
    });
  });
});
