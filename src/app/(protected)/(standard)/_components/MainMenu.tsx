'use client';

import NextLink from 'next/link';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GavelIcon from '@mui/icons-material/Gavel';
import CampaignIcon from '@mui/icons-material/Campaign';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useCurrentUser } from '@/app/_providers/themeMode';

const menuItems = [
  {
    href: '/forms',
    title: 'フォーム一覧',
    description: '回答可能なフォームを確認・回答できます',
    icon: AssignmentIcon,
    color: '#1976d2',
  },
  {
    href: '/punishments',
    title: '処罰履歴',
    description: '自分の処罰履歴を確認できます',
    icon: GavelIcon,
    color: '#d32f2f',
  },
  {
    href: '/announcements',
    title: 'お知らせ一覧',
    description: '運営からのお知らせを確認できます',
    icon: CampaignIcon,
    color: '#388e3c',
  },
];

const MainMenu = () => {
  const theme = useTheme();
  const user = useCurrentUser();
  const userName = user.name;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 700 }}
          gutterBottom
        >
          {userName ? `ようこそ、${userName} さん` : 'ようこそ'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          各機能にアクセスするには、下のカードをクリックしてください
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.href}
              elevation={2}
              sx={{
                height: '100%',
                borderRadius: 3,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <CardActionArea
                component={NextLink}
                href={item.href}
                sx={{ height: '100%' }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: '100%',
                    py: 4,
                    px: 3,
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${item.color}14`,
                      color: item.color,
                      mb: 1,
                    }}
                  >
                    <Icon sx={{ fontSize: 28 }} />
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: 700 }}
                      gutterBottom
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {item.description}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: item.color,
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      gap: 0.5,
                    }}
                  >
                    詳細を見る
                    <ArrowForwardIcon sx={{ fontSize: 18 }} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};

export default MainMenu;
