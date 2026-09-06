import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getMsalOriginMock, getCachedTokenMock, getSeichiProxyHeadersMock } =
  vi.hoisted(() => ({
    getMsalOriginMock: vi.fn(),
    getCachedTokenMock: vi.fn(),
    getSeichiProxyHeadersMock: vi.fn(),
  }));

vi.mock('@/env.server', () => ({
  getBackendServerUrl: vi.fn(),
  getMsalOrigin: getMsalOriginMock,
  getSeichiProxyHeaders: getSeichiProxyHeadersMock,
}));

vi.mock('@/user-token/mcToken', () => ({
  getCachedToken: getCachedTokenMock,
}));

import { buildBackendRequestHeaders, proxy } from '@/proxy';

beforeEach(() => {
  vi.clearAllMocks();
  getMsalOriginMock.mockReturnValue('https://portal.seichi.click');
  getCachedTokenMock.mockResolvedValue(null);
  getSeichiProxyHeadersMock.mockReturnValue({});
});

describe('proxy login redirect', () => {
  it('未ログイン時は request origin ではなく設定済み origin へ遷移する', async () => {
    const response = await proxy(
      new NextRequest('http://0.0.0.0:3000/admin/users')
    );

    expect(response.headers.get('location')).toBe(
      'https://portal.seichi.click/'
    );
  });

  it('未ログイン時に匿名許可対象外の API へアクセスすると 401 を返し、ログイン画面へはリダイレクトしない', async () => {
    const response = await proxy(
      new NextRequest('http://0.0.0.0:3000/api/proxy/api/v1/notifications')
    );

    expect(response.status).toBe(401);
    expect(response.headers.get('location')).toBeNull();
    expect(response.cookies.get('SEICHI_PORTAL__POST_LOGIN_REDIRECT')).toBe(
      undefined
    );
  });

  it('does not forward browser-owned custom headers and uses server metadata', () => {
    getSeichiProxyHeadersMock.mockReturnValue({
      'x-seichi-proxy-secret': 'server-secret',
      'x-seichi-client-ip': '203.0.113.10',
    });

    const headers = buildBackendRequestHeaders(
      new Headers({
        'x-seichi-proxy-secret': 'browser-secret',
        'x-seichi-client-ip': '198.51.100.5',
      }),
      null
    );

    expect(headers.get('x-seichi-proxy-secret')).toBe('server-secret');
    expect(headers.get('x-seichi-client-ip')).toBe('203.0.113.10');
  });

  it('removes browser-owned custom headers when the server secret is unavailable', () => {
    getSeichiProxyHeadersMock.mockReturnValue({});

    const headers = buildBackendRequestHeaders(
      new Headers({
        'x-seichi-proxy-secret': 'browser-secret',
        'x-seichi-client-ip': '198.51.100.5',
      }),
      null
    );

    expect(headers.has('x-seichi-proxy-secret')).toBe(false);
    expect(headers.has('x-seichi-client-ip')).toBe(false);
  });
});
