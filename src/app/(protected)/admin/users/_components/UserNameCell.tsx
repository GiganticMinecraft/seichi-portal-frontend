import { Avatar, Box, Typography } from '@mui/material';
import CopyButton from './CopyButton';

const UserNameCell = ({ id, name }: { id: string; name: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Avatar
      alt={name}
      src={`https://mc-heads.net/avatar/${id}/32`}
      sx={{ width: 32, height: 32 }}
    />
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography
        variant="body2"
        component="span"
        sx={{ fontWeight: 'medium' }}
      >
        {name}
      </Typography>
      <CopyButton value={name} />
    </Box>
  </Box>
);

export default UserNameCell;
