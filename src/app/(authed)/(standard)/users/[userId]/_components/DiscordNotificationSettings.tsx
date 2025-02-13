import { UpdateNotificationSettingsSchema } from '@/app/api/_schemas/RequestSchemas';
import { GetNotificationSettingsResponse } from '@/app/api/_schemas/ResponseSchemas';
import Checkbox from '@mui/material/Checkbox';
import {
  Button,
  Container,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

const DiscordNotificationSettings = (props: {
  currentSettings: GetNotificationSettingsResponse;
  userId: string;
}) => {
  const { handleSubmit, register } =
    useForm<UpdateNotificationSettingsSchema>();

  const onSubmit = async (data: UpdateNotificationSettingsSchema) => {
    const response = await fetch(`/api/proxy/notifications/settings/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log(response.status);

    if (response.ok) {
      alert('設定を更新しました');
    } else {
      alert('通知設定の更新に失敗しました');
    }
  };

  return (
    <Container component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <TextField
          {...register('recipient_id')}
          defaultValue={props.userId}
          hidden
        />
        <Typography variant="h6">Discord への通知設定</Typography>
        <FormControlLabel
          label="自身の回答に対するメッセージ通知を受け取る"
          control={
            <Checkbox
              defaultChecked={
                props.currentSettings.is_send_message_notification
              }
              {...register('is_send_message_notification')}
            />
          }
        />
        <Button variant="contained" endIcon={<SaveAltIcon />} type="submit">
          送信
        </Button>
      </Stack>
    </Container>
  );
};

export default DiscordNotificationSettings;
