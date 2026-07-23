import Chip from '@mui/material/Chip';
import type { SxProps, Theme } from '@mui/material/styles';

const RequiredChip = ({ sx }: { sx?: SxProps<Theme> }) => (
  <Chip size="small" color="error" label="必須" sx={sx} />
);

export default RequiredChip;
