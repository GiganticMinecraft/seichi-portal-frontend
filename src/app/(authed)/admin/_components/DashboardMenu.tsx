'use client';

import { Star } from '@mui/icons-material';
import {
  styled,
  Typography,
  MenuList,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const drawerWidth = 240;

const DashboardMenu = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Menu
      </Typography>
      <Demo>
        <MenuList>
          {['Dashboard', 'Forms', 'Announcements'].map((value) => {
            return (
              <MenuItem key={value}>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                {value}
              </MenuItem>
            );
          })}
        </MenuList>
      </Demo>
    </Drawer>
  );
};

export default DashboardMenu;
