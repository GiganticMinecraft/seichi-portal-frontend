'use client';

import { Star } from '@mui/icons-material';
import {
  styled,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function DashboardMenu() {
  return (
    <Grid item xs={12} md={6}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Menu
      </Typography>
      <Demo>
        <List>
          {['Dashboard', 'Forms', 'Announcements'].map((value) => {
            return (
              <ListItem key={value}>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary={value} />
              </ListItem>
            );
          })}
        </List>
      </Demo>
    </Grid>
  );
}
