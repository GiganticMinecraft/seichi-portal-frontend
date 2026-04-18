import LinkIcon from '@mui/icons-material/Link';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

const LinkDiscordButton = () => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Discord 連携</Typography>
            <Chip label="未連携" color="default" size="small" />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Discord と連携すると、回答へのメッセージ通知を受け取れます。
          </Typography>
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            href="/api/discord"
            sx={{ alignSelf: 'flex-start' }}
          >
            Discord と連携する
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LinkDiscordButton;
