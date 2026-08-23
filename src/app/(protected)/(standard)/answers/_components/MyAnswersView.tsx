'use client';

import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import type { RefObject } from 'react';

import AnswerStatusChip from '@/app/(protected)/_components/AnswerDetail/AnswerStatusChip';

import AnswerFormNameLabel from './AnswerFormNameLabel';
import type { MyAnswerListRow } from './myAnswerListRows';

const MyAnswersView = ({
  rows,
  hasMore,
  isLoadingMore,
  sentinelRef,
  onRowClick,
}: {
  rows: MyAnswerListRow[];
  hasMore: boolean;
  isLoadingMore: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
  onRowClick: (row: MyAnswerListRow) => void;
}) => (
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Stack spacing={3} sx={{ maxWidth: 800, width: '100%' }}>
      <Typography variant="h5" component="h1">
        自分の回答一覧
      </Typography>
      <Card variant="outlined">
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {rows.length === 0 && !hasMore ? (
            <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
              まだ回答がありません
            </Typography>
          ) : (
            <List disablePadding>
              {rows.map((row, index) => (
                <Box key={row.id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItemButton
                    onClick={() => {
                      onRowClick(row);
                    }}
                    sx={{ alignItems: 'flex-start', py: 1.5 }}
                  >
                    <ListItemText
                      primary={row.title}
                      secondary={
                        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                          >
                            <AnswerFormNameLabel formId={row.formId} />
                            <Typography
                              component="span"
                              variant="caption"
                              color="textSecondary"
                            >
                              {row.date}
                            </Typography>
                            <AnswerStatusChip status={row.status} />
                          </Stack>
                          {row.labels.length > 0 && (
                            <Stack
                              direction="row"
                              spacing={0.5}
                              useFlexGap
                              sx={{ flexWrap: 'wrap' }}
                            >
                              {row.labels.map((label) => (
                                <Chip
                                  key={label.id}
                                  label={label.name}
                                  size="small"
                                />
                              ))}
                            </Stack>
                          )}
                        </Stack>
                      }
                      slotProps={{
                        primary: {
                          variant: 'subtitle1',
                          sx: { fontWeight: 'bold' },
                        },
                        secondary: { component: 'div' },
                      }}
                    />
                  </ListItemButton>
                </Box>
              ))}
              {hasMore && (
                <Box
                  ref={sentinelRef}
                  sx={{ display: 'flex', justifyContent: 'center', p: 2 }}
                >
                  {isLoadingMore && <CircularProgress size={20} />}
                </Box>
              )}
            </List>
          )}
        </CardContent>
      </Card>
    </Stack>
  </Box>
);

export default MyAnswersView;
