import { Avatar, Box, Typography } from '@mui/material';

import CopyButton from '@/app/(protected)/_components/CopyButton';

const UserNameCell = ({ id, name }: { id: string; name: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
    <Avatar
      alt={name}
      src={`https://mc-heads.net/avatar/${id}/32`}
      sx={{ width: 32, height: 32, flexShrink: 0 }}
    />
    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
      <Typography
        variant="body2"
        component="span"
        sx={{
          fontWeight: 'medium',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </Typography>
      <CopyButton value={name} />
    </Box>
  </Box>
);

export default UserNameCell;
