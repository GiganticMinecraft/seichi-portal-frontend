'use client';

import { MoreVert } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatString } from '@/generic/DateFormatter';
import type {
  ConversationActionResult,
  ConversationCapabilities,
  ConversationEntryViewModel,
} from './conversationTypes';

type Props = {
  entry: ConversationEntryViewModel;
  capabilities: ConversationCapabilities;
  onUpdate?: (
    entryId: string,
    body: string
  ) => Promise<ConversationActionResult>;
  onDelete?: (entryId: string) => Promise<ConversationActionResult>;
};

/**
 * 投稿 1 件表示を共通化する component。
 * entry と capabilities だけを見て描画し、API 差分は持ち込まない。
 */
const ConversationEntry = ({
  entry,
  capabilities,
  onUpdate,
  onDelete,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const [draftBody, setDraftBody] = useState(entry.body);
  const [isEditing, setIsEditing] = useState(false);
  const [operationResultMessage, setOperationResultMessage] =
    useState<string>();

  const isAdmin = entry.authorRole === 'ADMINISTRATOR';
  const showMenuTrigger =
    capabilities.actionTrigger === 'menu' && (entry.canEdit || entry.canDelete);
  const showDeleteTrigger =
    capabilities.actionTrigger === 'icon' && entry.canDelete;

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    const result = await onDelete(entry.id);
    if (result.forbidden) {
      setOperationResultMessage('このメッセージを削除する権限がありません。');
    } else if (!result.success) {
      setOperationResultMessage(
        '不明なエラーが発生しました。もう一度お試しください。'
      );
    }
    setAnchorEl(undefined);
  };

  const handleUpdate = async () => {
    if (!onUpdate || draftBody === '') {
      return;
    }

    const result = await onUpdate(entry.id, draftBody);
    if (result.forbidden) {
      setOperationResultMessage('このメッセージを編集する権限がありません。');
      return;
    }

    if (!result.success) {
      setOperationResultMessage(
        '不明なエラーが発生しました。もう一度お試しください。'
      );
      return;
    }

    setOperationResultMessage(undefined);
    setIsEditing(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={1}>
        <Avatar
          alt="PlayerHead"
          src={`https://mc-heads.net/avatar/${entry.authorName}`}
          sx={{
            width: 36,
            height: 36,
            mt: 0.5,
            border: isAdmin ? 2 : 0,
            borderColor: 'success.main',
          }}
        />
      </Grid>
      <Grid size={showMenuTrigger ? 9 : 11}>
        <Stack spacing={0.25}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {entry.authorName}
            </Typography>
            {isAdmin && (
              <Chip
                avatar={
                  <Avatar
                    src="/server-icon.png"
                    sx={{ width: 18, height: 18 }}
                  />
                }
                label={capabilities.adminLabel}
                color="success"
                size="small"
                sx={{ height: 20 }}
              />
            )}
            {showDeleteTrigger && (
              <IconButton
                size="small"
                color="error"
                aria-label="delete"
                sx={{ p: 0.5, ml: 'auto' }}
                onClick={handleDelete}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {formatString(entry.timestamp)}
          </Typography>
        </Stack>
      </Grid>
      {showMenuTrigger && (
        <Grid size={2}>
          <IconButton
            color="primary"
            aria-label="その他の操作"
            onClick={(event: MouseEvent<HTMLElement>) =>
              setAnchorEl(event.currentTarget)
            }
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={anchorEl !== undefined}
            onClose={() => setAnchorEl(undefined)}
          >
            {entry.canEdit && (
              <MenuItem
                onClick={() => {
                  setOperationResultMessage(undefined);
                  setIsEditing(true);
                  setAnchorEl(undefined);
                }}
              >
                編集
              </MenuItem>
            )}
            {entry.canDelete && (
              <MenuItem onClick={handleDelete}>削除</MenuItem>
            )}
          </Menu>
        </Grid>
      )}
      <Grid size={1}></Grid>
      <Grid size={11}>
        {isEditing ? (
          <TextField
            defaultValue={entry.body}
            helperText="編集を確定するには Enter キー、キャンセルするには Esc キーを入力してください。"
            multiline
            fullWidth
            onChange={(event) => setDraftBody(event.target.value)}
            onKeyDown={async (event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                await handleUpdate();
              } else if (event.key === 'Escape') {
                setDraftBody(entry.body);
                setOperationResultMessage(undefined);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <Paper
            variant={entry.renderMode === 'plain' ? 'outlined' : undefined}
            sx={(theme) => ({
              p: entry.renderMode === 'plain' ? 1.5 : 0,
              backgroundColor:
                entry.renderMode === 'plain'
                  ? isAdmin
                    ? alpha(theme.palette.success.main, 0.08)
                    : theme.palette.grey[50]
                  : 'transparent',
              borderRadius: entry.renderMode === 'plain' ? 2 : 0,
              boxShadow: 'none',
            })}
          >
            {entry.renderMode === 'markdown' ? (
              <Box sx={{ whiteSpace: 'pre-wrap' }}>
                <Markdown remarkPlugins={[remarkGfm]}>{entry.body}</Markdown>
              </Box>
            ) : (
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {entry.body}
              </Typography>
            )}
          </Paper>
        )}
      </Grid>
      {operationResultMessage && (
        <Grid container size={12}>
          <Grid size={1}></Grid>
          <Grid size={11}>
            <Typography
              variant="caption"
              component="p"
              sx={{ color: 'error.main', marginTop: '10px' }}
            >
              {operationResultMessage}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default ConversationEntry;
