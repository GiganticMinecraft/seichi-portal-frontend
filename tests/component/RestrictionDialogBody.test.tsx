import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RestrictionDialogBody from '@/app/(protected)/admin/users/_components/RestrictionDialogBody';
import type {
  GetAnswerSubmitterRestrictionResponse,
  PutAnswerSubmitterRestrictionSchema,
} from '@/lib/api-types';

import { renderWithProviders, screen, waitFor } from './render';

type RestrictionQueryState = {
  data: GetAnswerSubmitterRestrictionResponse;
  error: Error | null;
  isLoading: boolean;
  mutate: ReturnType<typeof vi.fn<() => Promise<void>>>;
};

type RestrictionMocks = {
  queryState: RestrictionQueryState;
  restrictUser: ReturnType<
    typeof vi.fn<
      (
        uuid: string,
        body: PutAnswerSubmitterRestrictionSchema
      ) => Promise<{ success: boolean }>
    >
  >;
  unrestrictUser: ReturnType<
    typeof vi.fn<(uuid: string) => Promise<{ success: boolean }>>
  >;
};

const restrictionMocks = vi.hoisted<RestrictionMocks>(() => ({
  queryState: {
    data: null,
    error: null,
    isLoading: false,
    mutate: vi.fn<() => Promise<void>>(),
  },
  restrictUser:
    vi.fn<
      (
        uuid: string,
        body: PutAnswerSubmitterRestrictionSchema
      ) => Promise<{ success: boolean }>
    >(),
  unrestrictUser: vi.fn<(uuid: string) => Promise<{ success: boolean }>>(),
}));

vi.mock('@/app/_swr/useApiQuery', () => ({
  useApiQuery: () => restrictionMocks.queryState,
}));

vi.mock('@/hooks/useAnswerSubmitterRestrictionActions', () => ({
  useAnswerSubmitterRestrictionActions: () => ({
    restrictUser: restrictionMocks.restrictUser,
    unrestrictUser: restrictionMocks.unrestrictUser,
  }),
}));

describe('RestrictionDialogBody', () => {
  beforeEach(() => {
    restrictionMocks.queryState.data = null;
    restrictionMocks.queryState.error = null;
    restrictionMocks.queryState.isLoading = false;
    restrictionMocks.queryState.mutate.mockResolvedValue();
    restrictionMocks.restrictUser.mockResolvedValue({ success: true });
    restrictionMocks.unrestrictUser.mockResolvedValue({ success: true });
    vi.clearAllMocks();
  });

  it('未制限ユーザーに理由を入力して制限を付与する', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <RestrictionDialogBody uuid="user-uuid" onClose={onClose} />
    );

    await user.type(screen.getByRole('textbox', { name: /理由/ }), '迷惑投稿');
    await user.click(screen.getByRole('button', { name: '制限する' }));

    await waitFor(() => {
      expect(restrictionMocks.restrictUser).toHaveBeenCalledWith('user-uuid', {
        reason: '迷惑投稿',
      });
      expect(restrictionMocks.queryState.mutate).toHaveBeenCalledOnce();
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  it('理由が空白だけなら制限を付与せず validation error を表示する', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <RestrictionDialogBody uuid="user-uuid" onClose={vi.fn()} />
    );

    await user.type(screen.getByRole('textbox', { name: /理由/ }), '   ');
    await user.click(screen.getByRole('button', { name: '制限する' }));

    expect(await screen.findByText('理由を入力してください')).toBeVisible();
    expect(restrictionMocks.restrictUser).not.toHaveBeenCalled();
  });

  it('制限中ユーザーは現在の制限を表示して解除できる', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    restrictionMocks.queryState.data = {
      expires_at: null,
      id: 'restriction-id',
      reason: '迷惑投稿',
      restricted_at: '2026-06-29T10:00:00+09:00',
      restricted_by: 'operator-id',
      submitter_id: 'user-uuid',
    };

    renderWithProviders(
      <RestrictionDialogBody uuid="user-uuid" onClose={onClose} />
    );

    expect(screen.getByText(/理由:/)).toBeVisible();
    expect(screen.getByText(/迷惑投稿/)).toBeVisible();

    await user.click(screen.getByRole('button', { name: '制限を解除する' }));

    await waitFor(() => {
      expect(restrictionMocks.unrestrictUser).toHaveBeenCalledWith('user-uuid');
      expect(restrictionMocks.queryState.mutate).toHaveBeenCalledOnce();
      expect(onClose).toHaveBeenCalledOnce();
    });
  });
});
