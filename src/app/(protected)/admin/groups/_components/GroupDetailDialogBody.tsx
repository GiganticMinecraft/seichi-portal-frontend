'use client';

import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Button,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';

import { useApiQuery } from '@/app/_swr/useApiQuery';

const GroupDetailDialogBody = ({
  groupId,
  onClose,
}: {
  groupId: string;
  onClose: () => void;
}) => {
  const {
    data: members,
    error,
    isLoading,
  } = useApiQuery('/api/v1/user-groups/{group_id}/users', {
    path: { group_id: groupId },
  });

  if (isLoading) {
    return (
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </DialogContent>
    );
  }

  if (error || !members) {
    return (
      <DialogContent>
        <Alert severity="error">所属ユーザー一覧の取得に失敗しました。</Alert>
      </DialogContent>
    );
  }

  return (
    <>
      <DialogContent>
        {members.length > 0 ? (
          <List disablePadding>
            {members.map((member) => (
              <ListItem key={member.id} disableGutters>
                <ListItemAvatar>
                  <Avatar
                    alt={member.name}
                    src={`https://mc-heads.net/avatar/${member.id}/48`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={member.id}
                  slotProps={{
                    secondary: { sx: { fontFamily: 'monospace' } },
                  }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            所属しているユーザーはいません
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </>
  );
};

export default GroupDetailDialogBody;
