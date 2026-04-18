import LinkOffIcon from '@mui/icons-material/LinkOff';
import { Button, Chip, Stack, Typography } from '@mui/material';

const UnlinkDiscordButton = () => {
  const onClick = async () => {
    await fetch('/api/proxy/link-discord', {
      method: 'DELETE',
    });
    location.reload();
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6">Discord 連携</Typography>
        <Chip label="連携済み" color="success" size="small" />
      </Stack>
      <Button
        variant="outlined"
        color="error"
        startIcon={<LinkOffIcon />}
        onClick={onClick}
        size="small"
      >
        連携を解除する
      </Button>
    </Stack>
  );
};

export default UnlinkDiscordButton;
