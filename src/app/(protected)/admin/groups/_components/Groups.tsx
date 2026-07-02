'use client';

import { Box, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import NameEditDialog, {
  type NameEditFormValues,
} from '@/app/(protected)/_components/NameEditDialog';
import NameManagementTable from '@/app/(protected)/_components/NameManagementTable';
import ConfirmDialog from '@/app/_components/ConfirmDialog';
import SnackbarAlert, { useSnackbar } from '@/app/_components/SnackbarAlert';
import { useApiQuery } from '@/app/_swr/useApiQuery';
import { useUserGroupCRUD } from '@/hooks/useUserGroupCRUD';
import type { UserGroupSchema } from '@/lib/api-types';

import GroupDetailDialog from './GroupDetailDialog';

const Groups = (props: {
  groups: UserGroupSchema[];
  currentUserId: string;
}) => {
  const { data: groups = props.groups } = useApiQuery('/api/v1/user-groups');
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroupSchema | null>(
    null
  );
  const [detailGroup, setDetailGroup] = useState<UserGroupSchema | null>(null);

  const { handleSubmit, register, reset } = useForm<NameEditFormValues>();

  const { deleteGroup, editGroup } = useUserGroupCRUD();

  const handleOpenEdit = (group: UserGroupSchema) => {
    setSelectedGroup(group);
    reset({ id: group.id, name: group.name });
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

  const onEdit = async (data: NameEditFormValues) => {
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

  if (groups.length === 0) {
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
      <NameManagementTable
        items={groups}
        nameHeader="グループ名"
        onView={setDetailGroup}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <NameEditDialog
        open={editDialogOpen}
        title="グループを編集"
        nameLabel="グループ名"
        register={register}
        onClose={handleCloseEdit}
        onSubmit={(e) => {
          void handleSubmit(onEdit)(e);
        }}
      />

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
        currentUserId={props.currentUserId}
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
