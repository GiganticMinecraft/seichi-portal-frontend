import { Add } from '@mui/icons-material';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

const FormCreateButton = () => {
  return (
    <Button
      component={NextLink}
      variant="contained"
      startIcon={<Add />}
      href="/admin/forms/create"
      sx={(theme) => ({
        height: '36px',
        boxShadow: theme.shadows[6],
        borderRadius: 16,
        whiteSpace: 'nowrap',
      })}
    >
      新規作成
    </Button>
  );
};

export default FormCreateButton;
