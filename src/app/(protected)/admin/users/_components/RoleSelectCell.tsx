'use client';

import { MenuItem, Select, Tooltip } from '@mui/material';

import { useUserRoleActions } from '@/hooks/useUserRoleActions';

const RoleSelectCell = ({
  userId,
  currentRole,
  disabled,
}: {
  userId: string;
  currentRole: string;
  disabled: boolean;
}) => {
  const { updateUserRole } = useUserRoleActions();

  return (
    <Tooltip
      title={disabled ? '自分自身の権限は変更できません' : ''}
      placement="top"
    >
      <span>
        <Select
          defaultValue={currentRole}
          size="small"
          disabled={disabled}
          onChange={(event) => {
            void updateUserRole(userId, event.target.value);
          }}
        >
          <MenuItem value="STANDARD_USER">通常ユーザー</MenuItem>
          <MenuItem value="ADMINISTRATOR">管理者</MenuItem>
        </Select>
      </span>
    </Tooltip>
  );
};

export default RoleSelectCell;
