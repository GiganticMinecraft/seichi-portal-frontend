'use client';

import { Delete, Edit, Visibility } from '@mui/icons-material';
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
import { useUserGroupCRUD } from '@/hooks/useUserGroupCRUD';
import type { UserGroupSchema } from '@/lib/api-types';

import GroupDetailDialog from './GroupDetailDialog';

type EditGroupSchema = {
  id: string;
  name: string;
};

const Groups = (props: { groups: UserGroupSchema[] }) => {
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroupSchema | null>(
    null
  );
  const [detailGroup, setDetailGroup] = useState<UserGroupSchema | null>(null);

  const { handleSubmit, register, reset, setValue } =
    useForm<EditGroupSchema>();

  const { deleteGroup, editGroup } = useUserGroupCRUD();

  const handleOpenEdit = (group: UserGroupSchema) => {
    setSelectedGroup(group);
    setValue('id', group.id);
    setValue('name', group.name);
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setSelectedGroup(null);
    reset();
  };

  const handleOpenDelete = (group: UserGroupSchema) => {
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedGroup(null);
  };

  const onEdit = async (data: EditGroupSchema) => {
    const result = await editGroup(data.id, data.name);
    if (result.ok) {
      showSnackbar('グループを編集しました。', 'success');
      handleCloseEdit();
    } else {
      showSnackbar('グループの編集に失敗しました。', 'error');
    }
  };

  const onDelete = async () => {
    if (!selectedGroup) return;
    const result = await deleteGroup(selectedGroup.id);
    if (result.ok) {
      showSnackbar('グループを削除しました。', 'success');
      handleCloseDelete();
    } else {
      showSnackbar('グループの削除に失敗しました。', 'error');
    }
  };

  if (props.groups.length === 0) {
    return (
      <Box>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            グループが登録されていません。
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
              <TableCell>グループ名</TableCell>
              <TableCell align="right">アクション</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell component="th" scope="row">
                  {group.name}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="default"
                    onClick={() => {
                      setDetailGroup(group);
                    }}
                    aria-label="詳細"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      handleOpenEdit(group);
                    }}
                    aria-label="編集"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      handleOpenDelete(group);
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
        <DialogTitle>グループを編集</DialogTitle>
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
              label="グループ名"
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
        title="グループを削除"
        description={`「${selectedGroup?.name ?? ''}」を削除してもよろしいですか？この操作は元に戻せません。`}
        confirmLabel="削除"
        onConfirm={() => {
          void onDelete();
        }}
        onCancel={handleCloseDelete}
      />

      <GroupDetailDialog
        group={detailGroup}
        onClose={() => {
          setDetailGroup(null);
        }}
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

export default Groups;
