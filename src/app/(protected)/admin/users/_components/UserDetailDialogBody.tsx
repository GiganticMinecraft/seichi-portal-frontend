'use client';

import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  DialogActions,
  DialogContent,
  Button,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import CopyButton from '@/app/(protected)/_components/CopyButton';
import { useApiQuery } from '@/app/_swr/useApiQuery';

import RestrictionHistorySection from './RestrictionHistorySection';
import RestrictionManagementSection from './RestrictionManagementSection';
import RoleChip from './RoleChip';
import RoleSelectCell from './RoleSelectCell';
import UserGroupMembershipSection from './UserGroupMembershipSection';

const UserDetailDialogBody = ({
  uuid,
  canManageRole,
  canManageRestriction,
  onClose,
}: {
  uuid: string;
  canManageRole: boolean;
  canManageRestriction: boolean;
  onClose: () => void;
}) => {
  const {
    data: user,
    error: userError,
    isLoading: isUserLoading,
    mutate: mutateUser,
  } = useApiQuery('/api/v1/users/{uuid}', { path: { uuid } });

  if (isUserLoading) {
    return (
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </DialogContent>
    );
  }

  if (userError || !user) {
    return (
      <DialogContent>
        <Alert severity="error">ユーザー情報の取得に失敗しました。</Alert>
      </DialogContent>
    );
  }

  return (
    <>
      <DialogContent>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar
              alt={user.name}
              src={`https://mc-heads.net/avatar/${user.id}/48`}
              sx={{ width: 48, height: 48 }}
            />
            <Stack spacing={0.5}>
              <Typography variant="h6" component="p">
                {user.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                >
                  {user.id}
                </Typography>
                <CopyButton value={user.id} />
              </Box>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">所属グループ</Typography>
            <UserGroupMembershipSection
              uuid={user.id}
              currentGroups={user.groups}
              disabled={!canManageRestriction}
              onChanged={mutateUser}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">Discord連携</Typography>
            {user.discord_username || user.discord_user_id ? (
              <Typography variant="body2">
                {user.discord_username ?? '(ユーザー名不明)'}
                {user.discord_user_id && ` (ID: ${user.discord_user_id})`}
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary">
                連携されていません
              </Typography>
            )}
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle2">権限</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <RoleChip role={user.role} />
              <RoleSelectCell
                userId={user.id}
                currentRole={user.role}
                disabled={!canManageRole}
              />
            </Box>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle2">回答投稿制限</Typography>
            <RestrictionManagementSection
              uuid={user.id}
              disabled={!canManageRestriction}
            />
          </Stack>

          <RestrictionHistorySection uuid={user.id} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </>
  );
};

export default UserDetailDialogBody;
