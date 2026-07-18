'use client';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

import UserDetailDialog from '../UserDetailDialog/UserDetailDialog';

const UserDetailCell = ({
  userId,
  userName,
  canManageRole,
  canManageRestriction,
  autoOpen = false,
}: {
  userId: string;
  userName: string;
  canManageRole: boolean;
  canManageRestriction: boolean;
  autoOpen?: boolean;
}) => {
  const [open, setOpen] = useState(() => autoOpen);

  return (
    <Tooltip title="詳細を表示" placement="top">
      <span>
        <IconButton
          size="small"
          onClick={() => {
            setOpen(true);
          }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
        <UserDetailDialog
          uuid={userId}
          userName={userName}
          canManageRole={canManageRole}
          canManageRestriction={canManageRestriction}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        />
      </span>
    </Tooltip>
  );
};

export default UserDetailCell;
