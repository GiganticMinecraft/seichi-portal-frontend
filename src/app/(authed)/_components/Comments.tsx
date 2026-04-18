'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import {
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { useCommentActions } from '@/hooks/useCommentActions';
import { formatString } from '@/generic/DateFormatter';
import type { AnswerCommentType } from '@/lib/api-types';

type Comment = AnswerCommentType;

type SendCommentSchema = {
  answer_id: string;
  content: string;
};

type DeleteCommentSchema = {
  comment_id: number;
};

const CommentItem = (props: {
  comment: Comment;
  formId: string;
  answerId: number | string;
  showDeleteButton: boolean;
}) => {
  const { register, handleSubmit } = useForm<DeleteCommentSchema>();
  const { deleteComment } = useCommentActions(props.formId, props.answerId);

  const onDelete = async (data: DeleteCommentSchema) => {
    await deleteComment(data.comment_id);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={1}>
        <Avatar
          alt="PlayerHead"
          src={`https://mc-heads.net/avatar/${props.comment.commented_by.name}`}
        />
      </Grid>
      <Grid size={props.showDeleteButton ? 10 : 11}>
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
      {props.showDeleteButton && (
        <Grid size={1}>
          <IconButton
            onClick={handleSubmit(onDelete)}
            color="primary"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      )}
      <Grid size={1} />
      <Grid size={11}>
        <TextField
          {...register('comment_id')}
          value={props.comment.comment_id}
          type="hidden"
        />
        <Typography>{props.comment.content}</Typography>
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
    </Grid>
  );
};

const SendCommentForm = (props: {
  formId: string;
  answerId: number | string;
  inputSx?: object;
}) => {
  const { register, handleSubmit, reset } = useForm<SendCommentSchema>();
  const { sendComment } = useCommentActions(props.formId, props.answerId);

  const onSubmit = async (data: SendCommentSchema) => {
    await sendComment(data.content);
    reset();
  };

  return (
    <Container component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={10}>
          <TextField
            {...register('answer_id')}
            value={props.answerId}
            type="hidden"
          />
          <TextField
            {...register('content')}
            label="コメントを入力してください"
            sx={{ width: '100%', ...props.inputSx }}
            required
          />
        </Grid>
        <Grid
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
          }}
          size={2}
        >
          <Button variant="contained" endIcon={<SendIcon />} type="submit">
            送信
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

const Comments = (props: {
  comments: Comment[];
  formId: string;
  answerId: number | string;
  showDeleteButton?: boolean;
  inputSx?: object;
}) => {
  return (
    <Stack spacing={2}>
      <SendCommentForm
        formId={props.formId}
        answerId={props.answerId}
        {...(props.inputSx !== undefined && { inputSx: props.inputSx })}
      />
      {props.comments
        .slice()
        .reverse()
        .map((comment) => (
          <CommentItem
            key={comment.comment_id}
            comment={comment}
            formId={props.formId}
            answerId={props.answerId}
            showDeleteButton={props.showDeleteButton ?? false}
          />
        ))}
    </Stack>
  );
};

export default Comments;
