'use client';

import { AddCircle } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import SnackbarAlert, { useSnackbar } from '@/app/_components/SnackbarAlert';
import { useLabelCRUD } from '@/hooks/useLabelCRUD';

type CreateLabelSchema = {
  name: string;
};

const CreateLabelField = (props: { labelType: 'answers' | 'forms' }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateLabelSchema>();
  const { createLabel } = useLabelCRUD(props.labelType);

  const handleOpen = () => {
    setDialogOpen(true);
  };
  const handleClose = () => {
    setDialogOpen(false);
    reset();
  };

  const onSubmit = async (data: CreateLabelSchema) => {
    const result = await createLabel(data.name);
    if (result.ok) {
      showSnackbar('ラベルを作成しました。', 'success');
      handleClose();
    } else {
      showSnackbar('ラベルの作成に失敗しました。', 'error');
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
            <Button onClick={handleClose} disabled={isSubmitting}>
              キャンセル
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              作成
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </>
  );
};

export default CreateLabelField;
