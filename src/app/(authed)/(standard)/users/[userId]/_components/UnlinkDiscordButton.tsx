import Button from '@mui/material/Button';

const UnlinkDiscordButton = () => {
  const onClick = async () => {
    await fetch('/api/proxy/link-discord', {
      method: 'DELETE',
    });
  };

  return (
    <Button variant="contained" onClick={onClick}>
      Discord との連携を解除する
    </Button>
  );
};

export default UnlinkDiscordButton;
