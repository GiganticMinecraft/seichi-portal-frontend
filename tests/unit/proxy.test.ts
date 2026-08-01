import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getMsalOriginMock, getCachedTokenMock } = vi.hoisted(() => ({
  getMsalOriginMock: vi.fn(),
  getCachedTokenMock: vi.fn(),
}));

vi.mock('@/env.server', () => ({
  getBackendServerUrl: vi.fn(),
  getMsalOrigin: getMsalOriginMock,
}));

vi.mock('@/user-token/mcToken', () => ({
  getCachedToken: getCachedTokenMock,
}));

import { proxy } from '@/proxy';

beforeEach(() => {
  vi.clearAllMocks();
  getMsalOriginMock.mockReturnValue('https://portal.seichi.click');
  getCachedTokenMock.mockResolvedValue(null);
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
});
