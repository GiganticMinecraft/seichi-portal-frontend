'use client';

import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import {
  Typography,
  Box,
  AppBar,
  Toolbar,
  Link,
  Paper,
  IconButton,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import useSWR from 'swr';
import ErrorModal from '@/app/_components/ErrorModal';
import SearchResult from './SearchResult';
import type {
  ErrorResponse,
  GetNotificationResponse,
  GetUsersResponse,
} from '@/app/api/_schemas/ResponseSchemas';
import type { Either } from 'fp-ts/lib/Either';
import { NotificationsNone } from '@mui/icons-material';
import { match } from 'ts-pattern';

const SearchField = () => {
  const [openSearchResultModal, setOpenSearchResultModal] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        background: 'rgba(255, 255, 255, 0.15)',
      }}
    >
      <IconButton
        sx={{ p: '10px', color: '#FFFFFF' }}
        aria-label="search"
        onClick={() => setOpenSearchResultModal(true)}
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search..."
        inputProps={{ 'aria-label': 'search...' }}
        onChange={(event) => setSearchValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            setOpenSearchResultModal(true);
          }
        }}
      />
      {openSearchResultModal && (
        <SearchResult
          searchContent={searchValue}
          openState={openSearchResultModal}
          onClose={() => setOpenSearchResultModal(false)}
        />
      )}
    </Paper>
  );
};

const NavBar = () => {
  const { data } =
    useSWR<Either<ErrorResponse, GetUsersResponse>>('/api/proxy/users');
  const { data: notifications } = useSWR<
    Either<ErrorResponse, GetNotificationResponse[]>
  >('/api/proxy/notifications');
  const [anchorEl, setAnchorEl] = useState<undefined | HTMLElement>(undefined);

  if (data?._tag === 'Left' || notifications?._tag === 'Left') {
    return <ErrorModal />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: (theme) => theme.palette.secondary.main,
        }}
      >
        <Toolbar>
          <Image
            src="/favicon.ico"
            width={48}
            height={48}
            alt={'seichi-portal logo'}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, paddingLeft: '10px' }}
          >
            <Link href="/admin" color="#fff" sx={{ textDecoration: 'none' }}>
              Seichi Portal Admin
            </Link>
          </Typography>
          <SearchField />
          <IconButton
            color="primary"
            sx={{ marginLeft: '20px' }}
            onClick={(event: React.MouseEvent<HTMLElement>) =>
              setAnchorEl(event.currentTarget)
            }
          >
            {notifications?.right.length !== undefined &&
            notifications?.right.length > 0 ? (
              <NotificationsIcon />
            ) : (
              <NotificationsNone />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={anchorEl !== undefined}
            onClose={() => setAnchorEl(undefined)}
          >
            {notifications?.right.map((notification) => (
              <MenuItem key={notification.id}>
                {match(notification.source_type)
                  .with('MESSAGE', () => (
                    <Link
                      // TODO: どこにリンクを飛ばす？？？
                      // ここで降ってくる source_id は message_id なのでリンクとしては不正
                      href={`/admin/answer/${notification.source_id}/messages`}
                    >
                      <Typography>メッセージを受け取りました</Typography>
                    </Link>
                  ))
                  .exhaustive()}
              </MenuItem>
            ))}
          </Menu>
          <Avatar
            alt="PlayerHead"
            src={data ? `https://mc-heads.net/avatar/${data.right.uuid}` : ''}
            sx={{ marginLeft: '20px' }}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
