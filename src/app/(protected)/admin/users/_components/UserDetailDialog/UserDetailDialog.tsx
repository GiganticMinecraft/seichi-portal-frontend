'use client';

import { Dialog, DialogTitle } from '@mui/material';

import UserDetailDialogBody from './UserDetailDialogBody';

const UserDetailDialog = ({
  uuid,
  userName,
  canManageRole,
  canManageRestriction,
  open,
  onClose,
}: {
  uuid: string;
  userName: string;
  canManageRole: boolean;
  canManageRestriction: boolean;
  open: boolean;
  onClose: () => void;
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>ユーザー詳細: {userName}</DialogTitle>
    {/* open のときだけ body を mount し、GET を開いたときだけ走らせる。 */}
    {open && (
      <UserDetailDialogBody
        uuid={uuid}
        canManageRole={canManageRole}
        canManageRestriction={canManageRestriction}
        onClose={onClose}
      />
    )}
  </Dialog>
);

export default UserDetailDialog;
