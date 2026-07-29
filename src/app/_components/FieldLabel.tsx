import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import RequiredChip from '@/app/_components/RequiredChip';

const FieldLabel = ({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) => (
  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
    <Typography variant="body1">{label}</Typography>
    {required && <RequiredChip />}
  </Stack>
);

export default FieldLabel;
