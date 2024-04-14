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
        {['Dashboard', 'Forms', 'Announcements'].map((value) => {
          return (
            <MenuItem key={value}>
              <ListItemIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.56)',
                  paddingRight: '32px',
                }}
              >
                <Star />
              </ListItemIcon>
              {value}
            </MenuItem>
          );
        })}
      </MenuList>
      <Divider />
    </Drawer>
  );
};

export default DashboardMenu;
