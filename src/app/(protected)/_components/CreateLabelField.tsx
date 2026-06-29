'use client';

import { AddCircle } from '@mui/icons-material';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useLabelCRUD } from '@/hooks/useLabelCRUD';

type CreateLabelSchema = {
  name: string;
};

type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
};

const CreateLabelField = (props: { labelType: 'answers' | 'forms' }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { handleSubmit, register, reset } = useForm<CreateLabelSchema>();
  const { createLabel } = useLabelCRUD(props.labelType);

  const handleOpen = () => {
    setDialogOpen(true);
  };
  const handleClose = () => {
    setDialogOpen(false);
    reset();
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const onSubmit = async (data: CreateLabelSchema) => {
    const result = await createLabel(data.name);
    if (result.ok) {
      setSnackbar({
        open: true,
        message: 'ラベルを作成しました。',
        severity: 'success',
      });
      handleClose();
    } else {
      setSnackbar({
        open: true,
        message: 'ラベルの作成に失敗しました。',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddCircle />}
        onClick={handleOpen}
      >
        新規作成
      </Button>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth>
        <DialogTitle>新規ラベル作成</DialogTitle>
        <form
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e);
          }}
        >
          <DialogContent>
            <TextField
              {...register('name')}
              autoFocus
              margin="dense"
              label="ラベル名"
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button type="submit" variant="contained">
              作成
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateLabelField;
