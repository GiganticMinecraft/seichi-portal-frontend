'use client';

import { MoreVert, Restore } from '@mui/icons-material';
import {
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
  onRestored?: (() => void) | undefined;
}

const ArchivedFormRowMenu = ({ formId, onRestored }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { restoreForm } = useFormActions();
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRestore = async () => {
    handleClose();
    if (!confirm('このフォームを復元しますか？')) return;
    const result = await restoreForm(formId);
    if (result.ok) {
      onRestored?.();
    } else {
      alert('復元に失敗しました');
    }
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        aria-label="アーカイブ済みフォーム操作メニュー"
      >
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            void handleRestore();
          }}
        >
          <ListItemIcon>
            <Restore fontSize="small" />
          </ListItemIcon>
          <ListItemText>復元</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ArchivedFormRowMenu;
