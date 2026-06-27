'use client';

import { Chip, Stack, Tooltip, Typography } from '@mui/material';

interface Label {
  id: string;
  name: string;
}

interface Props {
  labels: Label[];
  max?: number;
}

const LabelChips = ({ labels, max = 2 }: Props) => {
  if (labels.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  const visible = labels.slice(0, max);
  const overflow = labels.slice(max);

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ flexWrap: 'nowrap', overflow: 'hidden', alignItems: 'center' }}
    >
      {visible.map((label) => (
        <Chip
          key={label.id}
          label={label.name}
          size="small"
          variant="outlined"
        />
      ))}
      {overflow.length > 0 && (
        <Tooltip
          title={
            <Stack spacing={0.5}>
              {overflow.map((label) => (
                <span key={label.id}>{label.name}</span>
              ))}
            </Stack>
          }
        >
          <Chip label={`+${overflow.length}`} size="small" />
        </Tooltip>
      )}
    </Stack>
  );
};

export default LabelChips;
