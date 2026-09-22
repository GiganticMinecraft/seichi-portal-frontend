import { describe, expect, it, vi } from 'vitest';

const { backendGetMock, requireUserMock } = vi.hoisted(() => ({
  backendGetMock: vi.fn(),
  requireUserMock: vi.fn<
    () => Promise<{
      state: 'authenticated';
      token: string;
      user: { id: string; name: string; role: string };
    }>
  >(),
}));

vi.mock('@/lib/server/backend', () => ({
  authorizationHeader: (token: string) => ({
    Authorization: `Bearer ${token}`,
  }),
  requireBackendData: async (request: Promise<unknown>) => request,
  serverApiClient: {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- HTTP メソッド名は大文字が正規の表記
    GET: (...args: unknown[]): unknown => backendGetMock(...args),
  },
}));

vi.mock('@/lib/server/session', () => ({
  requireUser: () => requireUserMock(),
}));

import UserPage from '@/app/(protected)/(standard)/users/me/page';

describe('本人のユーザーページ', () => {
  it('本人用 API からユーザー情報と通知設定を取得する', async () => {
    requireUserMock.mockResolvedValue({
      state: 'authenticated',
      token: 'token-123',
      user: {
        id: 'user-id',
        name: 'Alice',
        role: 'STANDARD_USER',
      },
    });
    backendGetMock
      .mockResolvedValueOnce({ id: 'user-id', name: 'Alice' })
      .mockResolvedValueOnce({ is_send_message_notification: true });

    await UserPage();

    const requestOptions = {
      headers: { Authorization: 'Bearer token-123' },
    };
    expect(backendGetMock).toHaveBeenCalledWith(
      '/api/v1/users/me',
      requestOptions
    );
    expect(backendGetMock).toHaveBeenCalledWith(
      '/api/v1/notifications/settings/me',
      requestOptions
    );
  });
});
