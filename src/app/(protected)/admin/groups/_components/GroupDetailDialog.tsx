'use client';

import { Dialog, DialogTitle } from '@mui/material';

import type { UserGroupSchema } from '@/lib/api-types';

import GroupDetailDialogBody from './GroupDetailDialogBody';

const GroupDetailDialog = ({
  group,
  onClose,
}: {
  group: UserGroupSchema | null;
  onClose: () => void;
}) => (
  <Dialog open={group !== null} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>グループ詳細: {group?.name}</DialogTitle>
    {/* open のときだけ body を mount し、GET を開いたときだけ走らせる。 */}
    {group && <GroupDetailDialogBody groupId={group.id} onClose={onClose} />}
  </Dialog>
);

export default GroupDetailDialog;
