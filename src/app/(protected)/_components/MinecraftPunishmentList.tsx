import { Divider, Stack, Typography } from '@mui/material';

import { formatString } from '@/generic/DateFormatter';
import type { GetMinecraftPunishmentsResponse } from '@/lib/api-types';

const MinecraftPunishmentList = ({
  punishments,
}: {
  punishments: GetMinecraftPunishmentsResponse;
}) =>
  punishments.length === 0 ? (
    <Typography variant="body2" component="p" color="textSecondary">
      処罰履歴はありません
    </Typography>
  ) : (
    <Stack divider={<Divider />} spacing={1.5}>
      {punishments.map((item) => (
        <Stack key={`${item.punished_at}-${item.reason}`} spacing={0.5}>
          <Typography component="p">
            <strong>理由:</strong> {item.reason}
          </Typography>
          <Typography component="p">
            <strong>処罰日時:</strong> {formatString(item.punished_at)}
          </Typography>
          <Typography component="p">
            <strong>期限:</strong>{' '}
            {item.expires_at ? formatString(item.expires_at) : '無期限'}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );

export default MinecraftPunishmentList;
