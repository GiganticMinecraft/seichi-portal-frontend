import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import type { GetUsersResponse } from '@/lib/api-types';

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Stack>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
      {value}
    </Typography>
  </Stack>
);

const UserInformation = (props: { user: GetUsersResponse }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ユーザー情報
        </Typography>
        <Stack spacing={2} divider={<Divider />}>
          <InfoRow label="Minecraft ユーザー名" value={props.user.name} />
          <InfoRow label="Minecraft UUID" value={props.user.id} />
          <InfoRow
            label="Discord ユーザー名"
            value={
              props.user['discord_username']
                ? String(props.user['discord_username'])
                : '未設定'
            }
          />
          <InfoRow
            label="Discord ID"
            value={
              props.user['discord_user_id']
                ? String(props.user['discord_user_id'])
                : '未設定'
            }
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserInformation;
