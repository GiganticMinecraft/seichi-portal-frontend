import { Label } from '@mui/icons-material';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

const ToManageFormLabelButton = () => {
  return (
    <Button
      component={NextLink}
      variant="contained"
      startIcon={<Label />}
      href="/admin/labels?tab=forms"
      sx={(theme) => ({
        width: '150px',
        height: '36px',
        boxShadow: theme.shadows[6],
        borderRadius: 16,
      })}
    >
      ラベルの管理
    </Button>
  );
};

export default ToManageFormLabelButton;
