'use client';

import { Button, Tooltip } from '@mui/material';
import { useState } from 'react';
import RestrictionDialog from './RestrictionDialog';

const RestrictionCell = ({
  userId,
  userName,
  disabled,
}: {
  userId: string;
  userName: string;
  disabled: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip title={disabled ? '自分自身は制限できません' : ''} placement="top">
      <span>
        <Button
          variant="outlined"
          size="small"
          color="error"
          disabled={disabled}
          onClick={() => setOpen(true)}
        >
          制限を管理
        </Button>
        <RestrictionDialog
          uuid={userId}
          userName={userName}
          open={open}
          onClose={() => setOpen(false)}
        />
      </span>
    </Tooltip>
  );
};

export default RestrictionCell;
