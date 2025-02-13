import Grid from '@mui/material/Grid2';
import type { GetUsersResponse } from '@/app/api/_schemas/ResponseSchemas';

const UserInformation = (props: { user: GetUsersResponse }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={2}>Minecraft ユーザー名: </Grid>
      <Grid size={2}>{props.user.name}</Grid>
      <Grid size={2}>Minecraft UUID: </Grid>
      <Grid size={6}>{props.user.uuid}</Grid>
      <Grid size={2}>Discord ユーザー名: </Grid>
      <Grid size={2}>
        {!props.user.discord_username ? '未設定' : props.user.discord_username}
      </Grid>
      <Grid size={2}>Discord ID: </Grid>
      <Grid size={6}>
        {!props.user.discord_user_id ? '未設定' : props.user.discord_user_id}
      </Grid>
    </Grid>
  );
};

export default UserInformation;
