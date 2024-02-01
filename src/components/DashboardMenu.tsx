'use client';

import { Star } from '@mui/icons-material';
import {
  styled,
  Grid,
  Typography,
  MenuList,
  MenuItem,
} from '@mui/material';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const DashboardMenu = () => {
  return (
    <Grid item xs={12} md={6}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Menu
      </Typography>
      <Demo>
        <MenuList>
          {['Dashboard', 'Forms', 'Announcements'].map((value) => {
            return (
              <MenuItem key={value}>
                <Star />
                {value}
              </MenuItem>
            );
          })}
        </MenuList>
      </Demo>
    </Grid>
  );
};

export default DashboardMenu;
