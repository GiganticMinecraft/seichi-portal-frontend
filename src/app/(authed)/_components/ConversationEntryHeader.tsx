'use client';

import { MoreVert } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import type { MouseEvent } from 'react';
import { formatString } from '@/generic/DateFormatter';
import type {
  ConversationCapabilities,
  ConversationEntryViewModel,
} from './conversationTypes';

type Props = {
  entry: ConversationEntryViewModel;
  capabilities: ConversationCapabilities;
  anchorEl: HTMLElement | undefined;
  onOpenMenu: (event: MouseEvent<HTMLElement>) => void;
  onCloseMenu: () => void;
  onStartEditing: () => void;
  onDelete: () => Promise<void>;
};

const ConversationEntryHeader = ({
  entry,
  capabilities,
  anchorEl,
  onOpenMenu,
  onCloseMenu,
  onStartEditing,
  onDelete,
}: Props) => {
  const isAdmin = entry.authorRole === 'ADMINISTRATOR';
  const showMenuTrigger =
    capabilities.actionTrigger === 'menu' && (entry.canEdit || entry.canDelete);
  const showDeleteTrigger =
    capabilities.actionTrigger === 'icon' && entry.canDelete;

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
      <Avatar
        alt="PlayerHead"
        src={`https://mc-heads.net/avatar/${entry.authorName}`}
        sx={{
          width: 36,
          height: 36,
          mt: 0.5,
          flexShrink: 0,
          border: isAdmin ? 2 : 0,
          borderColor: 'success.main',
        }}
      />
      <Stack sx={{ flex: 1 }} spacing={0.25}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography
            variant="subtitle2"
            component="span"
            sx={{ fontWeight: 600 }}
          >
            {entry.authorName}
          </Typography>
          {isAdmin && (
            <Chip
              avatar={
                <Avatar src="/server-icon.png" sx={{ width: 18, height: 18 }} />
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
              onClick={() => void onDelete()}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
        <Typography variant="caption" component="span" color="text.secondary">
          {formatString(entry.timestamp)}
        </Typography>
      </Stack>
      {showMenuTrigger && (
        <>
          <IconButton
            color="primary"
            aria-label="その他の操作"
            onClick={onOpenMenu}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={anchorEl !== undefined}
            onClose={onCloseMenu}
          >
            {entry.canEdit && (
              <MenuItem onClick={onStartEditing}>編集</MenuItem>
            )}
            {entry.canDelete && (
              <MenuItem onClick={() => void onDelete()}>削除</MenuItem>
            )}
          </Menu>
        </>
      )}
    </Stack>
  );
};

export default ConversationEntryHeader;
