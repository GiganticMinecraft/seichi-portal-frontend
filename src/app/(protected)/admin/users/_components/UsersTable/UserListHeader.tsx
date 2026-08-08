import { Search } from '@mui/icons-material';
import {
  Box,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import ToManageUserGroupsButton from './ToManageUserGroupsButton';

const UserListHeader = ({
  count,
  search,
  onSearchChange,
}: {
  count: number;
  search: string;
  onSearchChange: (value: string) => void;
}) => (
  <Box
    sx={{
      mb: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      flexWrap: 'wrap',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
        ユーザー管理
      </Typography>
      <Chip label={`${count} 件`} size="small" color="primary" />
    </Box>
    <ToManageUserGroupsButton />
    <TextField
      variant="standard"
      size="small"
      label="ユーザー検索"
      value={search}
      onChange={(e) => {
        onSearchChange(e.target.value);
      }}
      sx={{
        minWidth: { xs: 0, sm: 240 },
        width: { xs: '100%', sm: 'auto' },
        ml: { xs: 0, sm: 'auto' },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  </Box>
);

export default UserListHeader;
