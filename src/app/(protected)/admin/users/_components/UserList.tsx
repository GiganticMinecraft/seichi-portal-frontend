import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import UserListHeader from './UserListHeader';
import UserRow from './UserRow';
import { toUserListRows } from '../_lib/userListRows';
import type { GetUserListResponse } from '@/lib/api-types';

const UserList = ({
  users,
  currentUserId,
}: {
  users: GetUserListResponse;
  currentUserId: string;
}) => {
  const rows = toUserListRows(users, currentUserId);

  return (
    <Box sx={{ p: 3 }}>
      <UserListHeader count={rows.length} />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
              <TableCell>ユーザー</TableCell>
              <TableCell>UUID</TableCell>
              <TableCell>現在の権限</TableCell>
              <TableCell>権限の変更</TableCell>
              <TableCell>回答投稿制限</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <UserRow key={row.user.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
