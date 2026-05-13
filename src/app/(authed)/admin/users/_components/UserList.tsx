'use client';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useUserRoleActions } from '@/hooks/useUserRoleActions';
import type { GetUserListResponse } from '@/lib/api-types';

const RoleChip = ({ role }: { role: string }) => {
  const isAdmin = role === 'ADMINISTRATOR';
  return (
    <Chip
      icon={isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
      label={isAdmin ? '管理者' : '通常ユーザー'}
      color={isAdmin ? 'error' : 'default'}
      size="small"
      variant={isAdmin ? 'filled' : 'outlined'}
    />
  );
};

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Tooltip title={copied ? 'コピーしました' : 'コピー'} placement="top">
      <IconButton size="small" onClick={handleCopy} sx={{ ml: 0.5 }}>
        <ContentCopyIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

const UserList = (props: {
  users: GetUserListResponse;
  currentUserId: string;
}) => {
  const { updateUserRole } = useUserRoleActions();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          ユーザー管理
        </Typography>
        <Chip label={`${props.users.length} 件`} size="small" color="primary" />
      </Box>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
              <TableCell>ユーザー</TableCell>
              <TableCell>UUID</TableCell>
              <TableCell>現在の権限</TableCell>
              <TableCell>権限の変更</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.users.map((user) => {
              const isSelf = user.id === props.currentUserId;
              return (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ '&:last-child td': { border: 0 } }}
                >
                  <TableCell>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                    >
                      <Avatar
                        alt={user.name}
                        src={`https://mc-heads.net/avatar/${user.id}/32`}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 'medium' }}
                        >
                          {user.name}
                        </Typography>
                        <CopyButton value={user.name} />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title={user.id} placement="top">
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            color: 'text.secondary',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user.id}
                        </Typography>
                      </Tooltip>
                      <CopyButton value={user.id} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <RoleChip role={user.role} />
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={isSelf ? '自分自身の権限は変更できません' : ''}
                      placement="top"
                    >
                      <span>
                        <Select
                          defaultValue={user.role}
                          size="small"
                          disabled={isSelf}
                          onChange={async (event) => {
                            await updateUserRole(user.id, event.target.value);
                          }}
                        >
                          <MenuItem value="STANDARD_USER">
                            通常ユーザー
                          </MenuItem>
                          <MenuItem value="ADMINISTRATOR">管理者</MenuItem>
                        </Select>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
