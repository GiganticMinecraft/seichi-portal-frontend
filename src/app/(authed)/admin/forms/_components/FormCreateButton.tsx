import { Add } from '@mui/icons-material';
import Button from '@mui/material/Button';

const FormCreateButton = () => {
  return (
    <Button
      variant="contained"
      startIcon={<Add />}
      href="/admin/forms/create"
      sx={{
        width: '97px',
        height: '36px',
        boxShadow:
          '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12)',
        borderRadius: '64px',
      }}
    >
      NEW
    </Button>
  );
};

export default FormCreateButton;
