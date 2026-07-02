'use client';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Button,
  DialogActions,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import UserDetailDialog from '@/app/(protected)/admin/users/_components/UserDetailDialog';
import { useApiQuery } from '@/app/_swr/useApiQuery';

const GroupDetailDialogBody = ({
  groupId,
  currentUserId,
  onClose,
}: {
  groupId: string;
  currentUserId: string;
  onClose: () => void;
}) => {
  const {
    data: members,
    error,
    isLoading,
  } = useApiQuery('/api/v1/user-groups/{group_id}/users', {
    path: { group_id: groupId },
  });
  const [selectedMember, setSelectedMember] = useState<{
    id: string;
    name: string;
  } | null>(null);

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
            <ListItem
              key={member.id}
              disableGutters
              secondaryAction={
                <Tooltip title="ユーザー詳細を表示" placement="top">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedMember(member);
                    }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
            >
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
      <UserDetailDialog
        uuid={selectedMember?.id ?? ''}
        userName={selectedMember?.name ?? ''}
        canManageRole={selectedMember?.id !== currentUserId}
        canManageRestriction={selectedMember?.id !== currentUserId}
        open={selectedMember !== null}
        onClose={() => {
          setSelectedMember(null);
        }}
      />
    </>
  );
};

export default GroupDetailDialogBody;
