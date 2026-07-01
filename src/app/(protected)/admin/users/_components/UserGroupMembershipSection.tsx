'use client';

import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import { useUserGroupMembershipActions } from '@/hooks/useUserGroupMembershipActions';
import type { UserGroupSchema } from '@/lib/api-types';

const UserGroupMembershipSection = ({
  uuid,
  currentGroups,
  disabled,
  onChanged,
}: {
  uuid: string;
  currentGroups: UserGroupSchema[];
  disabled: boolean;
  onChanged: () => Promise<unknown>;
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: allGroups, isLoading: isGroupsLoading } = useApiQuery(
    '/api/v1/user-groups'
  );
  const { addUserToGroup, removeUserFromGroup } =
    useUserGroupMembershipActions();

  const joinableGroups = (allGroups ?? []).filter(
    (group) => !currentGroups.some((current) => current.id === group.id)
  );

  const handleAdd = async (group: UserGroupSchema) => {
    setSubmitError(null);
    const result = await addUserToGroup(group.id, uuid);
    if (result.success) {
      await onChanged();
    } else {
      setSubmitError('グループへの追加に失敗しました。');
    }
  };

  const handleRemove = async (group: UserGroupSchema) => {
    setSubmitError(null);
    const result = await removeUserFromGroup(group.id, uuid);
    if (result.success) {
      await onChanged();
    } else {
      setSubmitError('グループからの削除に失敗しました。');
    }
  };

  return (
    <Box>
      {submitError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {submitError}
        </Alert>
      )}
      {currentGroups.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {currentGroups.map((group) => (
            <Chip
              key={group.id}
              label={group.name}
              size="small"
              disabled={disabled}
              onDelete={
                disabled
                  ? undefined
                  : () => {
                      void handleRemove(group);
                    }
              }
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          所属しているグループはありません
        </Typography>
      )}
      <Autocomplete
        options={joinableGroups}
        getOptionLabel={(group) => group.name}
        value={null}
        disabled={disabled || isGroupsLoading}
        onChange={(_event, group) => {
          if (group) {
            void handleAdd(group);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} size="small" label="グループを追加" />
        )}
      />
    </Box>
  );
};

export default UserGroupMembershipSection;
