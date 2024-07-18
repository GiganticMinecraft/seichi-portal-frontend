import SendIcon from '@mui/icons-material/Send';
import { Chip, Divider, Grid, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { formatString } from '@/generic/DateFormatter';

type Comment = {
  timestamp: string;
  content: string;
  commented_by: {
    uuid: string;
    name: string;
    role: 'ADMINISTRATOR' | 'STANDARD_USER';
  };
};

const Comment = (props: { comment: Comment }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={1}>
        <Avatar
          alt="PlayerHead"
          src={`https://mc-heads.net/avatar/${props.comment.commented_by.uuid}`}
        />
      </Grid>
      <Grid item xs={11}>
        <Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {props.comment.commented_by.role === 'ADMINISTRATOR' ? (
              <Chip
                // TODO: server-icon.png の使用許可がでたら画像を配置する
                avatar={<Avatar src="/server-icon.png" />}
                label="運営チーム"
                color="success"
              />
            ) : (
              <></>
            )}
            <Typography>{props.comment.commented_by.name}</Typography>
          </Stack>
          <Typography>{formatString(props.comment.timestamp)}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={11}>
        <Typography>{props.comment.content}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
};

const SendCommentForm = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <TextField
          label="コメントを入力してください"
          sx={{ width: '100%' }}
          required
        />
      </Grid>
      <Grid
        item
        xs={2}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Button variant="contained" endIcon={<SendIcon />}>
          送信
        </Button>
      </Grid>
    </Grid>
  );
};

const Comments = (props: { comments: Comment[] }) => {
  return (
    <Stack spacing={2}>
      <SendCommentForm />
      {props.comments.map((comment, index) => (
        <Comment comment={comment} key={index} />
      ))}
    </Stack>
  );
};

export default Comments;
