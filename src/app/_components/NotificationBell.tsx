'use client';

import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { fromNow } from '@/generic/DateFormatter';
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationResponse } from '@/lib/api-types';

const toInternalPath = (url: string): string => {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
};

const NotificationBell = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const {
    items,
    unreadCount,
    hasMore,
    isLoadingMore,
    sentinelRef,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const handleItemClick = (notification: NotificationResponse) => {
    setAnchorEl(null);
    if (!notification.read_at) {
      void markAsRead(notification.id).catch(() => {});
    }
    router.push(toInternalPath(notification.url));
  };

  return (
    <Box>
      <Tooltip title="通知">
        <IconButton
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
          aria-controls={anchorEl ? 'notification-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={anchorEl ? 'true' : undefined}
          color="inherit"
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        id="notification-menu"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { width: 380, maxWidth: '100%' } } }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            通知
          </Typography>
          <Button
            size="small"
            disabled={unreadCount === 0}
            onClick={() => {
              void markAllAsRead().catch(() => {});
            }}
          >
            すべて既読にする
          </Button>
        </Box>
        <Divider />
        {items.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ px: 2, py: 3, textAlign: 'center', color: 'text.secondary' }}
          >
            通知はありません
          </Typography>
        ) : (
          <List disablePadding sx={{ maxHeight: 420, overflowY: 'auto' }}>
            {items.map((notification) => {
              const unread = !notification.read_at;
              return (
                <ListItemButton
                  key={notification.id}
                  onClick={() => {
                    handleItemClick(notification);
                  }}
                  sx={{
                    alignItems: 'flex-start',
                    gap: 1,
                    bgcolor: unread ? 'action.hover' : undefined,
                  }}
                >
                  <Box
                    sx={{
                      mt: '7px',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      flexShrink: 0,
                      bgcolor: unread ? 'error.main' : 'transparent',
                    }}
                  />
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            color: 'text.secondary',
                          }}
                        >
                          {notification.body}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            color: 'text.secondary',
                          }}
                        >
                          {fromNow(notification.created_at)}
                        </Typography>
                      </>
                    }
                    slotProps={{
                      primary: {
                        sx: { fontWeight: unread ? 'bold' : 'normal' },
                      },
                      secondary: { component: 'div' },
                    }}
                  />
                </ListItemButton>
              );
            })}
            {hasMore && (
              <Box ref={sentinelRef} sx={{ py: 1, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {isLoadingMore ? '読み込み中…' : ''}
                </Typography>
              </Box>
            )}
          </List>
        )}
      </Popover>
    </Box>
  );
};

export default NotificationBell;
