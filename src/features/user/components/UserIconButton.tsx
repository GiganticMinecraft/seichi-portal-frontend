'use client';

import { Avatar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

// TODO: add items
const menuItems = ['TEST'];

export const UserIconButton = () => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const handleOpenPopupMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleClosePopupMenu = () => {
    setMenuAnchor(null);
  };

  return (
    <>
      <IconButton onClick={handleOpenPopupMenu}>
        <Avatar>H</Avatar>
      </IconButton>
      <Menu
        sx={{ mt: '45px' }}
        anchorEl={menuAnchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        open={!!menuAnchor}
        onClose={handleClosePopupMenu}
      >
        {menuItems.map((item) => (
          <MenuItem key={item} onClick={handleClosePopupMenu}>
            <Typography textAlign="center">{item}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
