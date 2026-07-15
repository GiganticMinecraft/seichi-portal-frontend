'use client';

import LinkOffIcon from '@mui/icons-material/LinkOff';
import { Button, Chip, Stack, Typography } from '@mui/material';

import { useDiscordActions } from '@/hooks/useDiscordActions';
import { usePendingAction } from '@/hooks/usePendingAction';

const UnlinkDiscordButton = () => {
  const { unlinkDiscord } = useDiscordActions();
  const { run, pending } = usePendingAction(unlinkDiscord);

  const onClick = async () => {
    await run();
    location.reload();
  };

  return (
    <Stack
      direction="row"
      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant="h6">Discord 連携</Typography>
        <Chip label="連携済み" color="success" size="small" />
      </Stack>
      <Button
        variant="outlined"
        color="error"
        startIcon={<LinkOffIcon />}
        onClick={() => {
          void onClick();
        }}
        disabled={pending}
        size="small"
      >
        連携を解除する
      </Button>
    </Stack>
  );
};

export default UnlinkDiscordButton;
