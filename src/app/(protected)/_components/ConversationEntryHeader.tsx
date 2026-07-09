'use client';

import { MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';

import { formatString } from '@/generic/DateFormatter';

import {
  CONVERSATION_ENTRY_AVATAR_SIZE,
  CONVERSATION_ENTRY_HEADER_SPACING,
} from './conversationEntryLayout';
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
  onCopyLink: (url: string) => void;
};

const ConversationEntryHeader = ({
  entry,
  capabilities,
  anchorEl,
  onOpenMenu,
  onCloseMenu,
  onStartEditing,
  onDelete,
  onCopyLink,
}: Props) => {
  const pathname = usePathname();
  const isAdmin = entry.authorRole === 'ADMINISTRATOR';

  // window.location.origin はレンダー中(SSR/hydration)には安全に参照できないため、
  // 実際にクリックされた時にだけ評価する。
  const getCopyLinkUrl = () =>
    `${window.location.origin}${pathname}?${capabilities.deepLinkQueryParam}=${entry.id}`;

  const handleCopyLink = () => {
    onCopyLink(getCopyLinkUrl());
    onCloseMenu();
  };

  return (
    <Stack
      direction="row"
      spacing={CONVERSATION_ENTRY_HEADER_SPACING}
      sx={{ alignItems: 'flex-start' }}
    >
      <Avatar
        alt="PlayerHead"
        src={`https://mc-heads.net/avatar/${entry.authorName}`}
        sx={{
          width: CONVERSATION_ENTRY_AVATAR_SIZE,
          height: CONVERSATION_ENTRY_AVATAR_SIZE,
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
        </Stack>
        <Typography variant="caption" component="span" color="textSecondary">
          {formatString(entry.timestamp)}
        </Typography>
      </Stack>
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
        {entry.canEdit && <MenuItem onClick={onStartEditing}>編集</MenuItem>}
        <MenuItem onClick={handleCopyLink}>リンクをコピー</MenuItem>
        {entry.canDelete && (
          <MenuItem onClick={() => void onDelete()}>削除</MenuItem>
        )}
      </Menu>
    </Stack>
  );
};

export default ConversationEntryHeader;
