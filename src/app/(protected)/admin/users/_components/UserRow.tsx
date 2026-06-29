import { TableCell, TableRow } from '@mui/material';
import RestrictionCell from './RestrictionCell';
import RoleChip from './RoleChip';
import RoleSelectCell from './RoleSelectCell';
import UserIdCell from './UserIdCell';
import UserNameCell from './UserNameCell';
import type { UserListRow } from '../_lib/userListRows';

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
      <TableCell>
        <RoleSelectCell
          userId={user.id}
          currentRole={user.role}
          disabled={!row.canManageRole}
        />
      </TableCell>
      <TableCell>
        <RestrictionCell
          userId={user.id}
          userName={user.name}
          disabled={!row.canManageRestriction}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
