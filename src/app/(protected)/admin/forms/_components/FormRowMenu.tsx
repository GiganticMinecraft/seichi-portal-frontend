'use client';

import { Archive, Edit, MoreVert } from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import NextLink from 'next/link';
import { useState } from 'react';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { useFormActions } from '@/hooks/useFormActions';

interface Props {
  formId: string;
  onResult?: ((result: { ok: boolean }) => void) | undefined;
}

const FormRowMenu = ({ formId, onResult }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { archiveForm } = useFormActions();
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleArchiveClick = () => {
    handleMenuClose();
    setDialogOpen(true);
  };

  const handleArchiveConfirm = async () => {
    setDialogOpen(false);
    const result = await archiveForm(formId);
    onResult?.(result);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        aria-label="フォーム操作メニュー"
      >
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
        <MenuItem
          component={NextLink}
          href={`/admin/forms/edit/${formId}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>編集</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleArchiveClick}>
          <ListItemIcon>
            <Archive fontSize="small" />
          </ListItemIcon>
          <ListItemText>アーカイブ</ListItemText>
        </MenuItem>
      </Menu>
      <ConfirmDialog
        open={dialogOpen}
        title="フォームのアーカイブ"
        description="このフォームをアーカイブしますか？"
        confirmLabel="アーカイブ"
        onConfirm={() => {
          void handleArchiveConfirm();
        }}
        onCancel={() => {
          setDialogOpen(false);
        }}
      />
    </>
  );
};

export default FormRowMenu;
