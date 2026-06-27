import { TableCell, TableRow } from '@mui/material';
import RestrictionCell from './RestrictionCell';
import RoleChip from './RoleChip';
import RoleSelectCell from './RoleSelectCell';
import UserIdCell from './UserIdCell';
import UserNameCell from './UserNameCell';
import type { GetUserListResponse } from '@/lib/api-types';

const UserRow = ({
  user,
  isSelf,
}: {
  user: GetUserListResponse[number];
  isSelf: boolean;
}) => (
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
        disabled={isSelf}
      />
    </TableCell>
    <TableCell>
      <RestrictionCell
        userId={user.id}
        userName={user.name}
        disabled={isSelf}
      />
    </TableCell>
  </TableRow>
);

export default UserRow;
