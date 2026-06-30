'use client';

import { Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import SnackbarAlert, { useSnackbar } from '@/app/_components/SnackbarAlert';
import { useLabelCRUD } from '@/hooks/useLabelCRUD';

type Label = {
  id: string | number;
  name: string;
};

type EditLabelSchema = {
  id: string;
  name: string;
};

const Labels = (props: { labels: Label[]; labelType: 'answers' | 'forms' }) => {
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  const { handleSubmit, register, reset, setValue } =
    useForm<EditLabelSchema>();

  const { deleteLabel, editLabel: editLabelAction } = useLabelCRUD(
    props.labelType
  );

  const handleOpenEdit = (label: Label) => {
    setSelectedLabel(label);
    setValue('id', String(label.id));
    setValue('name', label.name);
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setSelectedLabel(null);
    reset();
  };

  const handleOpenDelete = (label: Label) => {
    setSelectedLabel(label);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedLabel(null);
  };

  const onEdit = async (data: EditLabelSchema) => {
    const result = await editLabelAction(data.id, data.name);
    if (result.ok) {
      showSnackbar('ラベルを編集しました。', 'success');
      handleCloseEdit();
    } else {
      showSnackbar('ラベルの編集に失敗しました。', 'error');
    }
  };

  const onDelete = async () => {
    if (!selectedLabel) return;
    const result = await deleteLabel(selectedLabel.id);
    if (result.ok) {
      showSnackbar('ラベルを削除しました。', 'success');
      handleCloseDelete();
    } else {
      showSnackbar('ラベルの削除に失敗しました。', 'error');
    }
  };

  if (props.labels.length === 0) {
    return (
      <Box>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            ラベルが登録されていません。
          </Typography>
        </Paper>
        <SnackbarAlert
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={closeSnackbar}
        />
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ラベル名</TableCell>
              <TableCell align="right">アクション</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.labels.map((label) => (
              <TableRow key={label.id}>
                <TableCell component="th" scope="row">
                  {label.name}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      handleOpenEdit(label);
                    }}
                    aria-label="編集"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      handleOpenDelete(label);
                    }}
                    aria-label="削除"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialogOpen} onClose={handleCloseEdit} fullWidth>
        <DialogTitle>ラベルを編集</DialogTitle>
        <Box
          component="form"
          onSubmit={(e) => {
            void handleSubmit(onEdit)(e);
          }}
        >
          <DialogContent>
            <TextField {...register('id')} type="hidden" />
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
            <Button onClick={handleCloseEdit}>キャンセル</Button>
            <Button type="submit" variant="contained">
              保存
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="ラベルを削除"
        description={`「${selectedLabel?.name ?? ''}」を削除してもよろしいですか？この操作は元に戻せません。`}
        confirmLabel="削除"
        onConfirm={() => {
          void onDelete();
        }}
        onCancel={handleCloseDelete}
      />

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </Box>
  );
};

export default Labels;
