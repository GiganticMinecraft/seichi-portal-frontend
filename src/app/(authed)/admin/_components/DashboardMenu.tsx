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

const drawerWidth = 240;

const DashboardMenu = () => {
  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          background:
            'linear-gradient(180deg, rgba(0, 31, 56, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%), #001F38',
          boxShadow:
            '0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)',
        },
      }}
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
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
        ].map((value, index) => {
          return (
            <MenuItem key={index} sx={{ color: 'white' }}>
              <ListItemIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.56)',
                  paddingRight: '32px',
                }}
              >
                <Star />
              </ListItemIcon>
              <Link
                href={value.url}
                color="#fff"
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
