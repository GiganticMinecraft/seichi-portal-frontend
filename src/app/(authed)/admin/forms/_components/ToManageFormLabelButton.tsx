import { Label } from '@mui/icons-material';
import Button from '@mui/material/Button';

const ToManageFormLabelButton = () => {
  return (
    <Button
      variant="contained"
      startIcon={<Label />}
      href="/admin/labels/forms"
      sx={{
        width: '150px',
        height: '36px',
        boxShadow:
          '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12)',
        borderRadius: '64px',
      }}
    >
      ラベルの管理
    </Button>
  );
};

export default ToManageFormLabelButton;
