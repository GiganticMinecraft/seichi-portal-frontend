'use client';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';
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
  comment_id: string;
};

const CommentItem = (props: {
  comment: Comment;
  formId: string;
  answerId: string;
  currentUserId: string | undefined;
  showDeleteButton: boolean;
}) => {
  const { register, handleSubmit } = useForm<DeleteCommentSchema>();
  const { deleteComment } = useCommentActions(props.formId, props.answerId);

  const onDelete = async (data: DeleteCommentSchema) => {
    await deleteComment(data.comment_id);
  };

  const canDelete =
    props.showDeleteButton ||
    (props.currentUserId !== undefined &&
      props.comment.commented_by.uuid === props.currentUserId);

  const isAdmin = props.comment.commented_by.role === 'ADMINISTRATOR';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'flex-start',
      }}
    >
      <Avatar
        alt="PlayerHead"
        src={`https://mc-heads.net/avatar/${props.comment.commented_by.name}`}
        sx={{
          width: 36,
          height: 36,
          mt: 0.5,
          border: isAdmin ? 2 : 0,
          borderColor: 'success.main',
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 0.5,
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {props.comment.commented_by.name}
          </Typography>
          {isAdmin && (
            <Chip
              avatar={
                <Avatar src="/server-icon.png" sx={{ width: 18, height: 18 }} />
              }
              label="運営"
              color="success"
              size="small"
              sx={{ height: 20 }}
            />
          )}
          <Typography variant="caption" color="text.secondary">
            {formatString(props.comment.timestamp)}
          </Typography>
          {canDelete && (
            <Box
              component="form"
              onSubmit={handleSubmit(onDelete)}
              sx={{ ml: 'auto' }}
            >
              <input
                {...register('comment_id')}
                value={props.comment.comment_id}
                type="hidden"
              />
              <IconButton
                type="submit"
                size="small"
                color="error"
                aria-label="delete"
                sx={{ p: 0.5 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
        <Paper
          variant="outlined"
          sx={(theme) => ({
            p: 1.5,
            backgroundColor: isAdmin
              ? alpha(theme.palette.success.main, 0.08)
              : theme.palette.grey[50],
            borderRadius: 2,
          })}
        >
          <Typography
            variant="body2"
            sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          >
            {props.comment.content}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

const SendCommentForm = (props: { formId: string; answerId: string }) => {
  const { register, handleSubmit, reset } = useForm<SendCommentSchema>();
  const { sendComment } = useCommentActions(props.formId, props.answerId);

  const onSubmit = async (data: SendCommentSchema) => {
    await sendComment(data.content);
    reset();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end' }}>
        <input
          {...register('answer_id')}
          value={props.answerId}
          type="hidden"
        />
        <TextField
          {...register('content')}
          placeholder="コメントを入力..."
          size="small"
          fullWidth
          required
          multiline
          maxRows={4}
        />
        <IconButton type="submit" color="primary" aria-label="send">
          <SendIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

const Comments = (props: {
  comments: Comment[];
  formId: string;
  answerId: string;
  currentUserId: string | undefined;
  showDeleteButton: boolean | undefined;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<Typography component="span">💬</Typography>}
      >
        コメント ({props.comments.length})
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: { xs: '100%', sm: 400 } } } }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6">コメント</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Toolbar>

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {props.comments.length === 0 && (
            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
              コメントはまだありません
            </Typography>
          )}
          {props.comments.map((comment) => (
            <CommentItem
              key={
                comment.comment_id ??
                `${comment.commented_by.name}-${comment.timestamp}`
              }
              comment={comment}
              formId={props.formId}
              answerId={props.answerId}
              currentUserId={props.currentUserId}
              showDeleteButton={props.showDeleteButton ?? false}
            />
          ))}
        </Box>

        <SendCommentForm formId={props.formId} answerId={props.answerId} />
      </Drawer>
    </>
  );
};

export default Comments;
