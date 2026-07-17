import { TableCell, TableRow } from '@mui/material';

import type { UserListRow } from '../../_lib/userListRows';
import RoleChip from '../RoleChip';

import UserDetailCell from './UserDetailCell';
import UserIdCell from './UserIdCell';
import UserNameCell from './UserNameCell';

const UserRow = ({ row }: { row: UserListRow }) => {
  const { user } = row;
  return (
    <TableRow hover sx={{ '&:last-child td': { border: 0 } }}>
      <TableCell>
        <UserNameCell id={user.id} name={user.name} />
      </TableCell>
      <TableCell>
        <UserIdCell id={user.id} />
      </TableCell>
      <TableCell>
        <RoleChip role={user.role} />
      </TableCell>
      <TableCell align="center">
        <UserDetailCell
          userId={user.id}
          userName={user.name}
          canManageRole={row.canManageRole}
          canManageRestriction={row.canManageRestriction}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
