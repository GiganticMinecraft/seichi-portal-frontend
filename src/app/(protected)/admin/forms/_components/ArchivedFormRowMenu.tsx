'use client';

import { MoreVert, Restore } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';

import { useFormActions } from '@/hooks/useFormActions';

interface Props {
  formId: string;
  onResult?: ((result: { ok: boolean }) => void) | undefined;
}

const ArchivedFormRowMenu = ({ formId, onResult }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { restoreForm } = useFormActions();
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRestoreClick = () => {
    handleMenuClose();
    setDialogOpen(true);
  };

  const handleRestoreConfirm = async () => {
    setDialogOpen(false);
    const result = await restoreForm(formId);
    onResult?.(result);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        aria-label="アーカイブ済みフォーム操作メニュー"
      >
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
        <MenuItem onClick={handleRestoreClick}>
          <ListItemIcon>
            <Restore fontSize="small" />
          </ListItemIcon>
          <ListItemText>復元</ListItemText>
        </MenuItem>
      </Menu>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <DialogTitle>フォームの復元</DialogTitle>
        <DialogContent>
          <DialogContentText>このフォームを復元しますか？</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            キャンセル
          </Button>
          <Button
            onClick={() => {
              void handleRestoreConfirm();
            }}
            autoFocus
          >
            復元
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ArchivedFormRowMenu;
