import { describe, expect, it, vi } from 'vitest';

import GroupDetailDialogBody from '@/app/(protected)/admin/groups/_components/GroupDetailDialogBody';
import type { GetUserGroupMembersResponse } from '@/lib/api-types';

import { renderWithProviders, screen } from './render';

type MembersQueryState = {
  data: GetUserGroupMembersResponse | undefined;
  error: Error | null;
  isLoading: boolean;
};

const queryState = vi.hoisted<{ current: MembersQueryState }>(() => ({
  current: { data: undefined, error: null, isLoading: false },
}));

vi.mock('@/app/_swr/useApiQuery', () => ({
  useApiQuery: () => queryState.current,
}));

describe('GroupDetailDialogBody', () => {
  it('所属ユーザーがいる場合は一覧表示する', () => {
    queryState.current = {
      data: [
        { groups: [], id: 'user-1', name: 'ユーザーA', role: 'user' },
        { groups: [], id: 'user-2', name: 'ユーザーB', role: 'user' },
      ],
      error: null,
      isLoading: false,
    };

    renderWithProviders(
      <GroupDetailDialogBody groupId="group-1" onClose={vi.fn()} />
    );

    expect(screen.getByText('ユーザーA')).toBeVisible();
    expect(screen.getByText('ユーザーB')).toBeVisible();
  });

  it('所属ユーザーがいない場合は空メッセージを表示する', () => {
    queryState.current = { data: [], error: null, isLoading: false };

    renderWithProviders(
      <GroupDetailDialogBody groupId="group-1" onClose={vi.fn()} />
    );

    expect(screen.getByText('所属しているユーザーはいません')).toBeVisible();
  });

  it('取得に失敗した場合はエラーを表示する', () => {
    queryState.current = {
      data: undefined,
      error: new Error('failed'),
      isLoading: false,
    };

    renderWithProviders(
      <GroupDetailDialogBody groupId="group-1" onClose={vi.fn()} />
    );

    expect(
      screen.getByText('所属ユーザー一覧の取得に失敗しました。')
    ).toBeVisible();
  });
});
