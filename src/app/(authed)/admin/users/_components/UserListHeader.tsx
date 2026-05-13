import { Box, Chip, Typography } from '@mui/material';

const UserListHeader = ({ count }: { count: number }) => (
  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
      ユーザー管理
    </Typography>
    <Chip label={`${count} 件`} size="small" color="primary" />
  </Box>
);

export default UserListHeader;
