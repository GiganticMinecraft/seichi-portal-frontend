'use client';

import { Close, Delete, Edit, Send } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
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

enum State {
  Success,
  Failed,
  None,
}

const Labels = (props: {
  labels: Label[];
  deleteEndpointBase: string;
  editEndpointBase: string;
}) => {
  const [deleteState, setDeleteState] = useState<State>(State.None);
  const [editState, setEditState] = useState<State>(State.None);
  const [editLabel, setEditLabel] = useState<Label>();
  const { handleSubmit, register } = useForm<EditLabelSchema>();

  const { deleteLabel, editLabel: editLabelAction } = useLabelCRUD(
    '',
    props.deleteEndpointBase,
    props.editEndpointBase
  );

  const onDeleteButtonClick = async (label: Label) => {
    const result = await deleteLabel(label.id);
    setDeleteState(result.ok ? State.Success : State.Failed);
  };

  const onEdit = async (data: EditLabelSchema) => {
    const result = await editLabelAction(data.id, data.name);
    if (result.ok) {
      setEditLabel(undefined);
      setEditState(State.Success);
    } else {
      setEditState(State.Failed);
    }
  };

  return (
    <List sx={{ width: '100%' }}>
      {deleteState === State.Success && (
        <Alert severity="success">ラベルを削除しました。</Alert>
      )}
      {deleteState === State.Failed && (
        <Alert severity="error">ラベルの削除に失敗しました。</Alert>
      )}
      {editState === State.Success && (
        <Alert severity="success">ラベルを編集しました。</Alert>
      )}
      {editState === State.Failed && (
        <Alert severity="error">ラベルの編集に失敗しました。</Alert>
      )}
      {props.labels.map((label, index) => (
        <Box key={index} component="form" onSubmit={handleSubmit(onEdit)}>
          <ListItem
            secondaryAction={
              editLabel === label ? (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<Close />}
                    onClick={() => setEditLabel(undefined)}
                  >
                    キャンセル
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Send />}
                    type="submit"
                  >
                    送信
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditLabel(label)}
                  >
                    編集
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Delete />}
                    onClick={() => onDeleteButtonClick(label)}
                  >
                    削除
                  </Button>
                </Stack>
              )
            }
          >
            {editLabel === label ? (
              <Box>
                <TextField {...register('id')} value={label.id} type="hidden" />
                <TextField {...register('name')} defaultValue={label.name} />
              </Box>
            ) : (
              <ListItemText
                sx={{ alignItems: 'center' }}
                primary={label.name}
              />
            )}
          </ListItem>
          <Divider />
        </Box>
      ))}
    </List>
  );
};

export default Labels;
