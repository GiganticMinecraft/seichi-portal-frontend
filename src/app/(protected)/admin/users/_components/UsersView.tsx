import {
  Box,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import type { UserListRow } from '../_lib/userListRows';

import UserListHeader from './UserListHeader';
import UserRow from './UserRow';

const UsersView = ({
  rows,
  search,
  onSearchChange,
  isLoading = false,
}: {
  rows: UserListRow[];
  search: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
}) => {
  return (
    <Box sx={{ p: 3 }}>
      <UserListHeader
        count={rows.length}
        search={search}
        onSearchChange={onSearchChange}
      />
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ position: 'relative' }}
      >
        {isLoading && (
          <LinearProgress
            sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
          />
        )}
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
              <TableCell sx={{ width: '24%' }}>ユーザー</TableCell>
              <TableCell sx={{ width: '26%' }}>UUID</TableCell>
              <TableCell sx={{ width: '14%' }}>現在の権限</TableCell>
              <TableCell sx={{ width: '18%' }}>権限の変更</TableCell>
              <TableCell sx={{ width: '18%' }}>回答投稿制限</TableCell>
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

export default UsersView;
