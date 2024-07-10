'use client';

import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

const ErrorModal = (props: { isErrorOccurred: boolean }) => {
  const now = dayjs().format();

  return (
    <Modal open={props.isErrorOccurred}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.default',
          display: 'grid',
          gridTemplateColumns: { md: '1fr 1fr' },
          gap: 2,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Stack>
          <Typography>データ取得中にエラーが発生しました。</Typography>
          <Typography>
            連続して発生する場合は管理者に問い合わせてください。
          </Typography>
          <Typography>timestamp: {now}</Typography>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
