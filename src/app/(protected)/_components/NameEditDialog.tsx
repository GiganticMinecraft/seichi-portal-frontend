'use client';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { UseFormRegister } from 'react-hook-form';

export type NameEditFormValues = {
  id: string;
  name: string;
};

const NameEditDialog = (props: {
  open: boolean;
  title: ReactNode;
  nameLabel: string;
  register: UseFormRegister<NameEditFormValues>;
  onClose: () => void;
  onSubmit: NonNullable<ComponentPropsWithoutRef<'form'>['onSubmit']>;
}) => (
  <Dialog open={props.open} onClose={props.onClose} fullWidth>
    <DialogTitle>{props.title}</DialogTitle>
    <Box component="form" onSubmit={props.onSubmit}>
      <DialogContent>
        <input {...props.register('id')} type="hidden" />
        <TextField
          {...props.register('name')}
          autoFocus
          margin="dense"
          label={props.nameLabel}
          fullWidth
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>キャンセル</Button>
        <Button type="submit" variant="contained">
          保存
        </Button>
      </DialogActions>
    </Box>
  </Dialog>
);

export default NameEditDialog;
