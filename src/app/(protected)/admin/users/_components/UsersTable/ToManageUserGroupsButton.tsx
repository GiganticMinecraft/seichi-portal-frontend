import { Groups } from '@mui/icons-material';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

const ToManageUserGroupsButton = () => {
  return (
    <Button
      component={NextLink}
      variant="outlined"
      startIcon={<Groups />}
      href="/admin/groups"
    >
      グループの管理
    </Button>
  );
};

export default ToManageUserGroupsButton;
