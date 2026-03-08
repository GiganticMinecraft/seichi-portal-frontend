import { MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { errorResponseSchema } from '@/lib/api-types';
import { formatString } from '@/generic/DateFormatter';

type Message = {
  id: string;
  body: string;
  sender: {
    uuid: string;
    name: string;
    role: string;
  };
  timestamp: string;
};

const Message = (props: {
  message: Message;
  answerId: number;
  edittingMessageId: string | undefined;
  handleEdit: () => void;
  handleCancelEditting: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<undefined | HTMLElement>(undefined);
  const [edittingMessage, setEdittingMessage] = useState<string>();
  const [operationResultMessage, setOperationResultMessage] = useState<
    string | undefined
  >(undefined);

  const updateMessage = async (
    body: string
  ): Promise<{ success: boolean; forbidden?: boolean }> => {
    const response = await fetch(
      `/api/proxy/forms/answers/${props.answerId}/messages/${props.message.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
      }
    );

    if (response.ok) {
      return { success: true };
    }

    const parseResult = errorResponseSchema.safeParse(await response.json());
    if (parseResult.success && parseResult.data.errorCode === 'FORBIDDEN') {
      return { success: false, forbidden: true };
    }
    return { success: false };
  };

  const deleteMessage = async () => {
    const response = await fetch(
      `/api/proxy/forms/answers/${props.answerId}/messages/${props.message.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const parseResult = errorResponseSchema.safeParse(await response.json());

      if (parseResult.success && parseResult.data.errorCode === 'FORBIDDEN') {
        setOperationResultMessage('このメッセージを削除する権限がありません。');
      } else {
        setOperationResultMessage(
          '不明なエラーが発生しました。もう一度お試しください。'
        );
      }
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={1}>
        <Avatar
          alt="PlayerHead"
          src={`https://mc-heads.net/avatar/${props.message.sender.name}`}
        />
      </Grid>
      <Grid size={9}>
        <Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {props.message.sender.role === 'ADMINISTRATOR' ? (
              <Chip
                avatar={<Avatar src="/server-icon.png" />}
                label="運営チーム"
                color="success"
              />
            ) : null}
            <Typography>{props.message.sender.name}</Typography>
          </Stack>
          <Typography>{formatString(props.message.timestamp)}</Typography>
        </Stack>
      </Grid>
      <Grid size={2}>
        <IconButton
          color="primary"
          onClick={(event: React.MouseEvent<HTMLElement>) =>
            setAnchorEl(event.currentTarget)
          }
        >
          <MoreVert />
        </IconButton>
      </Grid>
      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== undefined}
        onClose={() => setAnchorEl(undefined)}
      >
        <MenuItem onClick={() => props.handleEdit()}>編集</MenuItem>
        <MenuItem onClick={deleteMessage}>削除</MenuItem>
      </Menu>
      <Grid size={1}></Grid>
      <Grid size={11}>
        {props.edittingMessageId === props.message.id ? (
          <TextField
            defaultValue={props.message.body}
            helperText="編集を確定するには Enter キー、キャンセルするには Esc キーを入力してください。"
            multiline
            onChange={(event) => setEdittingMessage(event.target.value)}
            onKeyDown={async (event) => {
              if (
                event.key === 'Enter' &&
                edittingMessage !== undefined &&
                edittingMessage !== ''
              ) {
                const result = await updateMessage(edittingMessage);

                if (result.forbidden) {
                  setOperationResultMessage(
                    'このメッセージを編集する権限がありません。'
                  );
                } else if (result.success) {
                  props.handleCancelEditting();
                } else {
                  setOperationResultMessage(
                    '不明なエラーが発生しました。もう一度お試しください。'
                  );
                }
              } else if (event.key === 'Escape') {
                setOperationResultMessage(undefined);
                props.handleCancelEditting();
              }
            }}
          />
        ) : (
          <Box sx={{ whiteSpace: 'pre-wrap' }}>
            <Markdown remarkPlugins={[remarkGfm]}>
              {props.message.body}
            </Markdown>
          </Box>
        )}
      </Grid>
      {operationResultMessage === undefined ? null : (
        <Box sx={{ width: '100%' }}>
          <Grid size={1}></Grid>
          <Grid size={11}>
            <Typography
              sx={{ color: '#FF2D2D', fontSize: '12px', marginTop: '10px' }}
            >
              {operationResultMessage}
            </Typography>
          </Grid>
        </Box>
      )}
    </Grid>
  );
};

const Messages = (props: { messages: Message[]; answerId: number }) => {
  const [edittingMessageId, setEdittingMessageId] = useState<
    string | undefined
  >(undefined);

  return (
    <Stack spacing={2}>
      {props.messages.map((message) => (
        <Stack key={message.id} spacing={2}>
          <Message
            message={message}
            answerId={props.answerId}
            edittingMessageId={edittingMessageId}
            handleEdit={() => setEdittingMessageId(message.id)}
            handleCancelEditting={() => setEdittingMessageId(undefined)}
          />
          <Divider />
        </Stack>
      ))}
    </Stack>
  );
};

export default Messages;
