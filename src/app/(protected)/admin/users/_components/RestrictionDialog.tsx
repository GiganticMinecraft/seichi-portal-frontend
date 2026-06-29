'use client';

import { Dialog, DialogTitle } from '@mui/material';

import RestrictionDialogBody from './RestrictionDialogBody';

const RestrictionDialog = ({
  uuid,
  userName,
  open,
  onClose,
}: {
  uuid: string;
  userName: string;
  open: boolean;
  onClose: () => void;
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>回答投稿制限: {userName}</DialogTitle>
    {/* open のときだけ body を mount し、GET を開いたときだけ走らせる。 */}
    {open && <RestrictionDialogBody uuid={uuid} onClose={onClose} />}
  </Dialog>
);

export default RestrictionDialog;
