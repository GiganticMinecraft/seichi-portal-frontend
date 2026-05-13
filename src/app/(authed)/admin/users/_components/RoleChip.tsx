import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { Chip } from '@mui/material';

const RoleChip = ({ role }: { role: string }) => {
  const isAdmin = role === 'ADMINISTRATOR';
  return (
    <Chip
      icon={isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
      label={isAdmin ? '管理者' : '通常ユーザー'}
      color={isAdmin ? 'error' : 'default'}
      size="small"
      variant={isAdmin ? 'filled' : 'outlined'}
    />
  );
};

export default RoleChip;
