import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { getDiscordConfigMock, getCachedTokenMock, linkDiscordMock } =
  vi.hoisted(() => ({
    getDiscordConfigMock: vi.fn(),
    getCachedTokenMock: vi.fn(),
    linkDiscordMock: vi.fn(),
  }));

vi.mock('@/env.server', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/env.server')>()),
  getDiscordConfig: getDiscordConfigMock,
}));

vi.mock('@/user-token/mcToken', () => ({
  getCachedToken: getCachedTokenMock,
}));

vi.mock('@/lib/server/backend', () => ({
  authorizationHeader: (token: string) => ({
    Authorization: `Bearer ${token}`,
  }),
  serverApiClient: {
    POST: linkDiscordMock,
  },
}));

import { GET } from '@/app/api/discord/route';

const DISCORD_OAUTH_STATE_COOKIE = 'SEICHI_PORTAL__DISCORD_OAUTH_STATE';
const DISCORD_RETURN_TO_COOKIE = 'SEICHI_PORTAL__DISCORD_RETURN_TO';
const discordRedirectUri = 'https://portal.seichi.click/api/discord';
const originalRedirectUrl = process.env['MS_APP_REDIRECT_URL'];

const request = (url: string, cookie?: string) => {
  if (cookie === undefined) return new NextRequest(url);

  return new NextRequest(url, { headers: { cookie } });
};

beforeEach(() => {
  vi.clearAllMocks();
  process.env['MS_APP_REDIRECT_URL'] = 'https://portal.seichi.click';
  getDiscordConfigMock.mockReturnValue({
    clientId: 'discord-client-id',
    clientSecret: 'discord-client-secret',
    redirectUri: discordRedirectUri,
  });
});

afterEach(() => {
  if (originalRedirectUrl === undefined) {
    delete process.env['MS_APP_REDIRECT_URL'];
  } else {
    process.env['MS_APP_REDIRECT_URL'] = originalRedirectUrl;
  }
  vi.unstubAllGlobals();
});

describe('Discord OAuth route', () => {
  it('未ログイン時は設定済み origin の login へ遷移し、復帰先 cookie を設定する', async () => {
    getCachedTokenMock.mockResolvedValue(null);

    const response = await GET(
      request('http://0.0.0.0:3000/api/discord?from=internal')
    );

    expect(response.headers.get('location')).toBe(
      'https://portal.seichi.click/login'
    );
    expect(response.headers.get('set-cookie')).toContain(
      'SEICHI_PORTAL__POST_LOGIN_REDIRECT='
    );
  });

  it('認証済みで code がない場合は raw の Discord redirect URI を authorize URL に渡す', async () => {
    getCachedTokenMock.mockResolvedValue('seichi-token');

    const response = await GET(request('http://0.0.0.0:3000/api/discord'));
    const location = new URL(response.headers.get('location') ?? '');

    expect(location.origin).toBe('https://discord.com');
    expect(location.pathname).toBe('/oauth2/authorize');
    expect(location.searchParams.get('redirect_uri')).toBe(discordRedirectUri);
    expect(location.searchParams.get('client_id')).toBe('discord-client-id');
    expect(response.headers.get('set-cookie')).toContain(
      `${DISCORD_OAUTH_STATE_COOKIE}=`
    );
    expect(response.headers.get('set-cookie')).toContain(
      `${DISCORD_RETURN_TO_COOKIE}=%2F;`
    );
  });

  it('returnTo クエリを渡した場合はその値を復帰先 cookie に保存する', async () => {
    getCachedTokenMock.mockResolvedValue('seichi-token');

    const response = await GET(
      request('http://0.0.0.0:3000/api/discord?returnTo=/users/user-id')
    );

    expect(response.headers.get('set-cookie')).toContain(
      `${DISCORD_RETURN_TO_COOKIE}=%2Fusers%2Fuser-id;`
    );
  });

  it('state が不正な場合は設定済み origin の badrequest へ遷移し、state cookie を削除する', async () => {
    getCachedTokenMock.mockResolvedValue('seichi-token');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await GET(
      request(
        'http://0.0.0.0:3000/api/discord?code=code&state=request-state',
        `${DISCORD_OAUTH_STATE_COOKIE}=stored-state`
      )
    );

    expect(response.headers.get('location')).toBe(
      'https://portal.seichi.click/badrequest'
    );
    expect(response.headers.get('set-cookie')).toContain(
      `${DISCORD_OAUTH_STATE_COOKIE}=;`
    );
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(linkDiscordMock).not.toHaveBeenCalled();
  });

  it.each([
    ['http://localhost:3000', 'http://localhost:3000/'],
    ['https://portal.seichi.click', 'https://portal.seichi.click/'],
  ])(
    'MS_APP_REDIRECT_URL=%s の連携成功後は %s へ遷移し、token body と link payload を維持する',
    async (redirectUrl, expectedLocation) => {
      process.env['MS_APP_REDIRECT_URL'] = redirectUrl;
      getCachedTokenMock.mockResolvedValue('seichi-token');
      linkDiscordMock.mockResolvedValue({
        response: new Response(null, { status: 204 }),
      });
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({ access_token: 'discord-access-token' }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        )
      );

      const response = await GET(
        request(
          'http://0.0.0.0:3000/api/discord?code=code&state=stored-state',
          `${DISCORD_OAUTH_STATE_COOKIE}=stored-state`
        )
      );

      expect(response.headers.get('location')).toBe(expectedLocation);
      expect(response.headers.get('set-cookie')).toContain(
        `${DISCORD_OAUTH_STATE_COOKIE}=;`
      );
      expect(response.headers.get('set-cookie')).toContain('Max-Age=0');

      const fetchMock = vi.mocked(fetch);
      const [, fetchInit] = fetchMock.mock.calls[0] ?? [];
      expect(fetchInit).toMatchObject({
        method: 'POST',
        body: new URLSearchParams({
          client_id: 'discord-client-id',
          client_secret: 'discord-client-secret',
          code: 'code',
          grant_type: 'authorization_code',
          redirect_uri: discordRedirectUri,
        }).toString(),
      });
      expect(linkDiscordMock).toHaveBeenCalledWith('/api/v1/link-discord', {
        headers: { Authorization: 'Bearer seichi-token' },
        body: { token: 'discord-access-token' },
      });
    }
  );

  it('復帰先 cookie がある場合は連携成功後にその画面へ遷移し、cookie を削除する', async () => {
    getCachedTokenMock.mockResolvedValue('seichi-token');
    linkDiscordMock.mockResolvedValue({
      response: new Response(null, { status: 204 }),
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ access_token: 'discord-access-token' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    const response = await GET(
      request(
        'http://0.0.0.0:3000/api/discord?code=code&state=stored-state',
        [
          `${DISCORD_OAUTH_STATE_COOKIE}=stored-state`,
          `${DISCORD_RETURN_TO_COOKIE}=%2Fusers%2Fuser-id`,
        ].join('; ')
      )
    );

    expect(response.headers.get('location')).toBe(
      'https://portal.seichi.click/users/user-id'
    );
    expect(response.headers.get('set-cookie')).toContain(
      `${DISCORD_RETURN_TO_COOKIE}=;`
    );
  });
});
