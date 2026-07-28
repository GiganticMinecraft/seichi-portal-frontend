import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

import MinecraftPunishmentList from '@/app/(protected)/_components/MinecraftPunishmentList';
import type { GetMinecraftPunishmentsResponse } from '@/lib/api-types';

const PunishmentHistoryView = ({
  punishments,
}: {
  punishments: GetMinecraftPunishmentsResponse;
}) => (
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Stack spacing={3} sx={{ maxWidth: 640, width: '100%' }}>
      <Typography variant="h5" component="h1">
        処罰履歴
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <MinecraftPunishmentList punishments={punishments} />
        </CardContent>
      </Card>
    </Stack>
  </Box>
);

export default PunishmentHistoryView;
