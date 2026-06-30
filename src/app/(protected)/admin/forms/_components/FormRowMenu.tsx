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

import { useFormActions } from '@/hooks/useFormActions';

interface Props {
  formId: string;
  onArchived?: (() => void) | undefined;
}

const FormRowMenu = ({ formId, onArchived }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { archiveForm } = useFormActions();
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleArchive = async () => {
    handleClose();
    if (!confirm('このフォームをアーカイブしますか？')) return;
    const result = await archiveForm(formId);
    if (result.ok) {
      onArchived?.();
    } else {
      alert('アーカイブに失敗しました');
    }
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        aria-label="フォーム操作メニュー"
      >
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          component={NextLink}
          href={`/admin/forms/edit/${formId}`}
          onClick={handleClose}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>編集</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            void handleArchive();
          }}
        >
          <ListItemIcon>
            <Archive fontSize="small" />
          </ListItemIcon>
          <ListItemText>アーカイブ</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default FormRowMenu;
