'use client';

import { MoreVert, Restore } from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import type { MouseEvent } from 'react';
import { useState } from 'react';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { useFormActions } from '@/hooks/useFormActions';
import { usePendingAction } from '@/hooks/usePendingAction';

interface Props {
  formId: string;
  onResult?: ((result: { ok: boolean }) => void) | undefined;
}

const ArchivedFormRowMenu = ({ formId, onResult }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { restoreForm } = useFormActions();
  const { run: runRestoreForm, pending } = usePendingAction(restoreForm);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
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
    const result = await runRestoreForm(formId);
    setDialogOpen(false);
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
      <ConfirmDialog
        open={dialogOpen}
        title="フォームの復元"
        description="このフォームを復元しますか？"
        confirmLabel="復元"
        pending={pending}
        onConfirm={() => {
          void handleRestoreConfirm();
        }}
        onCancel={() => {
          setDialogOpen(false);
        }}
      />
    </>
  );
};

export default ArchivedFormRowMenu;
