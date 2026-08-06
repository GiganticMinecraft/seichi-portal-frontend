import type { GetUserGroupsResponse } from '@/lib/api-types';

import type { FormVisibility } from '../../_schema/formEditorSchema';

export type AudienceMember = { id: string; name: string };

const ADMIN_MEMBER: AudienceMember = { id: '__admin__', name: '管理者' };
const ALL_AUTHENTICATED_MEMBER: AudienceMember = {
  id: '__all_authenticated__',
  name: 'ログイン済みユーザー（全員）',
};

export const answerViewAudience = (
  answerVisibility: FormVisibility,
  answerGroupIds: string[],
  groupOptions: GetUserGroupsResponse
): AudienceMember[] => {
  if (answerVisibility === 'PRIVATE') {
    return [ADMIN_MEMBER];
  }

  if (answerGroupIds.length > 0) {
    const groups = groupOptions.filter((group) =>
      answerGroupIds.includes(group.id)
    );

    return [...groups, ADMIN_MEMBER];
  }

  return [ALL_AUTHENTICATED_MEMBER, ADMIN_MEMBER];
};
