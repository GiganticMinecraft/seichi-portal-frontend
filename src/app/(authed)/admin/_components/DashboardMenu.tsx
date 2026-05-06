'use client';

import { Star } from '@mui/icons-material';
import {
  Typography,
  MenuList,
  MenuItem,
  ListItemIcon,
  Divider,
  Link,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import NextLink from 'next/link';

const drawerWidth = 240;

const DashboardMenu = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
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
        ].map((value, index) => {
          return (
            <MenuItem key={index} sx={{ color: 'text.primary' }}>
              <ListItemIcon
                sx={{
                  color: 'text.secondary',
                  paddingRight: '32px',
                }}
              >
                <Star />
              </ListItemIcon>
              <Link
                component={NextLink}
                href={value.url}
                color="inherit"
                sx={{ textDecoration: 'none' }}
              >
                {value.label}
              </Link>
            </MenuItem>
          );
        })}
      </MenuList>
      <Divider />
    </Drawer>
  );
};

export default DashboardMenu;
