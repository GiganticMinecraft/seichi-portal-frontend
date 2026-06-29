'use client';

import { Delete, Edit } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
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

import { useLabelCRUD } from '@/hooks/useLabelCRUD';

type Label = {
  id: string | number;
  name: string;
};

type EditLabelSchema = {
  id: string;
  name: string;
};

type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
};

const Labels = (props: { labels: Label[]; labelType: 'answers' | 'forms' }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  const { handleSubmit, register, reset, setValue } =
    useForm<EditLabelSchema>();

  const { deleteLabel, editLabel: editLabelAction } = useLabelCRUD(
    props.labelType
  );

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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

      {/* 編集ダイアログ */}
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

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
        <DialogTitle>ラベルを削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            「{selectedLabel?.name}
            」を削除してもよろしいですか？この操作は元に戻せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>キャンセル</Button>
          <Button
            onClick={() => {
              void onDelete();
            }}
            color="error"
            variant="contained"
          >
            削除
          </Button>
        </DialogActions>
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
    </Box>
  );
};

export default Labels;
