'use client';

import {
  Divider,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import type { GetUserListResponse } from '@/app/api/_schemas/ResponseSchemas';

const UserList = (props: { users: GetUserListResponse }) => {
  return (
    <List sx={{ width: '100%' }}>
      <ListItem>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: 'space-between', width: '100%' }}
        >
          <ListItemText sx={{ alignItems: 'center' }} primary={'ユーザー名'} />
          <ListItemText sx={{ alignItems: 'center' }} primary={'UUID'} />
          <ListItemText sx={{ alignItems: 'center' }} primary={'権限'} />
        </Stack>
      </ListItem>
      <Divider />
      {props.users.map((user, index) => (
        <ListItem
          key={index}
          secondaryAction={
            <Select
              defaultValue={user.role}
              onChange={async (event) => {
                await fetch(`/api/proxy/forms/users/${user.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ role: event.target.value }),
                });
              }}
            >
              <MenuItem value="STANDARD_USER">通常ユーザー</MenuItem>
              <MenuItem value="ADMINISTRATOR">管理者</MenuItem>
            </Select>
          }
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'space-between', width: '100%' }}
          >
            <ListItemText sx={{ alignItems: 'center' }} primary={user.name} />
            <ListItemText sx={{ alignItems: 'center' }} primary={user.id} />
          </Stack>
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;
