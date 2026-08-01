'use client';

import { Box, Tooltip, Typography } from '@mui/material';

import CopyButton from '@/app/(protected)/_components/CopyButton';

const UserIdCell = ({ id }: { id: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
    <Tooltip title={id} placement="top">
      <Typography
        variant="body2"
        component="span"
        sx={{
          fontFamily: 'monospace',
          color: 'text.secondary',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {id}
      </Typography>
    </Tooltip>
    <CopyButton value={id} />
  </Box>
);

export default UserIdCell;
