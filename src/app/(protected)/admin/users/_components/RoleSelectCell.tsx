'use client';

import { MenuItem, Select, Tooltip } from '@mui/material';
import { useState } from 'react';

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
  const [role, setRole] = useState(currentRole);
  const [syncedRole, setSyncedRole] = useState(currentRole);

  if (currentRole !== syncedRole) {
    setSyncedRole(currentRole);
    setRole(currentRole);
  }

  return (
    <Tooltip
      title={disabled ? '自分自身の権限は変更できません' : ''}
      placement="top"
    >
      <span>
        <Select
          value={role}
          size="small"
          disabled={disabled}
          onChange={(event) => {
            const newRole = event.target.value;
            setRole(newRole);
            updateUserRole(userId, newRole).catch(() => {
              setRole(currentRole);
            });
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
