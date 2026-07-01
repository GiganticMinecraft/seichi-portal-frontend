'use client';

import { Star } from '@mui/icons-material';
import {
  Typography,
  MenuList,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import NextLink from 'next/link';

import { AUTCHED_DRAWER_WIDTH_PX } from '../../layoutConstants';

const DashboardMenu = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: AUTCHED_DRAWER_WIDTH_PX,
        [`& .MuiDrawer-paper`]: {
          width: AUTCHED_DRAWER_WIDTH_PX,
          boxSizing: 'border-box',
          boxShadow:
            '0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Typography sx={{ mt: 4, mb: 2, px: 2 }} variant="h6" component="div">
        Menu
      </Typography>
      <MenuList>
        {[
          {
            label: 'Dashboard',
            url: '/admin',
          },
          {
            label: 'Forms',
            url: '/admin/forms',
          },
          {
            label: 'Announcements',
            url: '/admin/announcements',
          },
          {
            label: 'Users',
            url: '/admin/users',
          },
          {
            label: 'Groups',
            url: '/admin/groups',
          },
        ].map((value) => {
          return (
            <MenuItem
              key={value.url}
              component={NextLink}
              href={value.url}
              sx={{ color: 'text.primary', textDecoration: 'none' }}
            >
              <ListItemIcon
                sx={{
                  color: 'text.secondary',
                  paddingRight: '32px',
                }}
              >
                <Star />
              </ListItemIcon>
              {value.label}
            </MenuItem>
          );
        })}
      </MenuList>
      <Divider />
    </Drawer>
  );
};

export default DashboardMenu;
