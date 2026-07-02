'use client';

import { Box, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import ConfirmDialog from '@/app/_components/ConfirmDialog';
import SnackbarAlert, { useSnackbar } from '@/app/_components/SnackbarAlert';
import { useLabelCRUD } from '@/hooks/useLabelCRUD';

import NameEditDialog, { type NameEditFormValues } from './NameEditDialog';
import NameManagementTable from './NameManagementTable';

type Label = {
  id: string | number;
  name: string;
};

const Labels = (props: { labels: Label[]; labelType: 'answers' | 'forms' }) => {
  const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  const { handleSubmit, register, reset } = useForm<NameEditFormValues>();

  const { deleteLabel, editLabel: editLabelAction } = useLabelCRUD(
    props.labelType
  );

  const handleOpenEdit = (label: Label) => {
    setSelectedLabel(label);
    reset({ id: String(label.id), name: label.name });
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

  const onEdit = async (data: NameEditFormValues) => {
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
      <NameManagementTable
        items={props.labels}
        nameHeader="ラベル名"
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <NameEditDialog
        open={editDialogOpen}
        title="ラベルを編集"
        nameLabel="ラベル名"
        register={register}
        onClose={handleCloseEdit}
        onSubmit={(e) => {
          void handleSubmit(onEdit)(e);
        }}
      />

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
