import { Delete, Edit } from '@mui/icons-material';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Divider,
} from '@mui/material';

type Label = {
  id: number;
  name: string;
};

const Labels = (props: { labels: Label[] }) => {
  return (
    <List sx={{ width: '100%' }}>
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

const Label = (props: { label: Label }) => {
  return (
    <Stack direction="row" spacing={2}>
      <Typography>{props.label.name}</Typography>
      <Button variant="contained" startIcon={<Edit />}>
        EDIT
      </Button>
      <Button variant="contained" color="secondary" startIcon={<Delete />}>
        DELETE
      </Button>
    </Stack>
  );
};

export default Labels;
