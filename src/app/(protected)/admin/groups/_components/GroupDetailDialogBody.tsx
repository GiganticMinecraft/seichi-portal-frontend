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

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error || !members) {
      return (
        <Alert severity="error">所属ユーザー一覧の取得に失敗しました。</Alert>
      );
    }

    if (members.length > 0) {
      return (
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
      );
    }

    return (
      <Typography variant="body2" color="text.secondary" component="p">
        所属しているユーザーはいません
      </Typography>
    );
  };

  return (
    <>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </>
  );
};

export default GroupDetailDialogBody;
