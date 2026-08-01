'use client';

import { Button } from '@mui/material';
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

  const [prevAutoOpen, setPrevAutoOpen] = useState(autoOpen);
  if (autoOpen !== prevAutoOpen) {
    setPrevAutoOpen(autoOpen);
    if (autoOpen) {
      setOpen(true);
    }
  }

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
      >
        詳細
      </Button>
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
    </>
  );
};

export default UserDetailCell;
