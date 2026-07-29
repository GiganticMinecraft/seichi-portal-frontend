'use client';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { UseFormRegister } from 'react-hook-form';

import FieldLabel from '@/app/_components/FieldLabel';

export type NameEditFormValues = {
  id: string;
  name: string;
};

const NameEditDialog = (props: {
  open: boolean;
  title: ReactNode;
  nameLabel: string;
  register: UseFormRegister<NameEditFormValues>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: NonNullable<ComponentPropsWithoutRef<'form'>['onSubmit']>;
}) => (
  <Dialog
    open={props.open}
    onClose={props.isSubmitting ? undefined : props.onClose}
    fullWidth
  >
    <DialogTitle>{props.title}</DialogTitle>
    <Box component="form" onSubmit={props.onSubmit}>
      <DialogContent>
        <input {...props.register('id')} type="hidden" />
        <Stack spacing={0.5} sx={{ mt: 1 }}>
          <FieldLabel label={props.nameLabel} required />
          <TextField
            {...props.register('name')}
            autoFocus
            fullWidth
            slotProps={{ htmlInput: { 'aria-label': props.nameLabel } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} disabled={props.isSubmitting}>
          キャンセル
        </Button>
        <Button type="submit" variant="contained" disabled={props.isSubmitting}>
          保存
        </Button>
      </DialogActions>
    </Box>
  </Dialog>
);

export default NameEditDialog;
