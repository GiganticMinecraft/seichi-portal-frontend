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
  startSessionMock: vi.fn(),
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
