import { Delete, Edit } from '@mui/icons-material';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { useState } from 'react';

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

  const onDeleteButtonClick = async (label: Label) => {
    const response = await fetch(`/api/answers/labels/${label.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      setDeleteState(State.Success);
    } else {
      setDeleteState(State.Failed);
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
      {props.labels.map((label, index) => (
        <Stack>
          <ListItem
            secondaryAction={
              <Stack direction="row" spacing={2}>
                <Button variant="contained" startIcon={<Edit />}>
                  EDIT
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Delete />}
                  onClick={() => onDeleteButtonClick(label)}
                >
                  DELETE
                </Button>
              </Stack>
            }
            key={index}
          >
            <ListItemText sx={{ alignItems: 'center' }} primary={label.name} />
          </ListItem>
          <Divider />
        </Stack>
      ))}
    </List>
  );
};

export default Labels;
