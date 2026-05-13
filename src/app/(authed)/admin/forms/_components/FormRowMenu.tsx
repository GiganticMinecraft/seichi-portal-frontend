'use client';

import { Delete, Edit, MoreVert } from '@mui/icons-material';
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
}

const FormRowMenu = ({ formId }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { deleteForm } = useFormActions();
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    handleClose();
    if (!confirm('本当に削除しますか？')) return;
    const result = await deleteForm(formId);
    if (result.ok) {
      alert('削除しました');
    } else {
      alert('削除に失敗しました');
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
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>削除</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default FormRowMenu;
