import { Close, Delete, Edit, Send } from '@mui/icons-material';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Divider,
  Alert,
  Box,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { EditLabelSchema } from '../_schemas/labelSchemas';

type Label = {
  id: number;
  name: string;
};

enum State {
  Success,
  Failed,
  None,
}

const Labels = (props: { labels: Label[] }) => {
  const [deleteState, setDeleteState] = useState<State>(State.None);
  const [editState, setEditState] = useState<State>(State.None);
  const [editLabel, setEditLabel] = useState<Label>();
  const { handleSubmit, register } = useForm<EditLabelSchema>();

  const onDeleteButtonClick = async (label: Label) => {
    const response = await fetch(
      `/api/proxy/forms/labels/answers/${label.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      setDeleteState(State.Success);
    } else {
      setDeleteState(State.Failed);
    }
  };

  const onEdit = async (data: EditLabelSchema) => {
    const response = await fetch(`/api/proxy/forms/labels/answers/${data.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: data.name }),
    });

    if (response.ok) {
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
