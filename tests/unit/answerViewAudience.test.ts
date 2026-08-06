import { describe, expect, it } from 'vitest';

import { answerViewAudience } from '@/app/(protected)/admin/forms/_components/FormEditor/answerViewAudience';
import type { GetUserGroupsResponse } from '@/lib/api-types';

const groupOptions: GetUserGroupsResponse = [
  { id: 'group-a', name: 'Aグループ' },
  { id: 'group-b', name: 'Bグループ' },
];

describe('answerViewAudience', () => {
  it('非公開の場合はグループ指定に関わらず管理者のみを返す', () => {
    expect(answerViewAudience('PRIVATE', [], groupOptions)).toEqual([
      { id: '__admin__', name: '管理者' },
    ]);
    expect(answerViewAudience('PRIVATE', ['group-a'], groupOptions)).toEqual([
      { id: '__admin__', name: '管理者' },
    ]);
  });

  it('公開かつグループ未指定の場合はログイン済みユーザー全員と管理者を返す', () => {
    expect(answerViewAudience('PUBLIC', [], groupOptions)).toEqual([
      { id: '__all_authenticated__', name: 'ログイン済みユーザー（全員）' },
      { id: '__admin__', name: '管理者' },
    ]);
  });

  it('公開かつグループ指定ありの場合は該当グループと管理者を返す', () => {
    expect(
      answerViewAudience('PUBLIC', ['group-a', 'group-b'], groupOptions)
    ).toEqual([
      { id: 'group-a', name: 'Aグループ' },
      { id: 'group-b', name: 'Bグループ' },
      { id: '__admin__', name: '管理者' },
    ]);
  });
});
