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
import type { GetUserListResponse } from '@/lib/api-types';

const UserList = ({
  users,
  currentUserId,
}: {
  users: GetUserListResponse;
  currentUserId: string;
}) => (
  <Box sx={{ p: 3 }}>
    <UserListHeader count={users.length} />
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
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelf={user.id === currentUserId}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default UserList;
