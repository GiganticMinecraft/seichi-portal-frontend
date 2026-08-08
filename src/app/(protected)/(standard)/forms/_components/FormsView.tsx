'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Typography,
  Alert,
  AlertTitle,
} from '@mui/material';
import NextLink from 'next/link';

import InfiniteScrollSentinel from '@/app/_components/InfiniteScrollSentinel';
import MarkdownText from '@/app/_components/MarkdownText';
import { useInfiniteApiQuery } from '@/app/_swr/useInfiniteApiQuery';
import type { GetFormsPageResponse, GetFormsResponse } from '@/lib/api-types';
import {
  formatResponsePeriod,
  toResponsePeriod,
} from '@/lib/forms/responsePeriod';

type FormItem = GetFormsResponse[number];

const EachForm = ({ form }: { form: FormItem }) => {
  const responsePeriod = toResponsePeriod(
    form.settings.answer_settings.acceptance_period
  );

  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardActionArea component={NextLink} href={`/forms/${form.id}`}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {form.title}
          </Typography>
          <Chip
            icon={<AccessTimeIcon />}
            label={formatResponsePeriod(responsePeriod)}
            size="small"
            variant="outlined"
            sx={{ mb: 1.5 }}
          />
          {form.description && (
            <MarkdownText
              sx={{
                typography: 'body2',
                color: 'text.secondary',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {form.description}
            </MarkdownText>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          component={NextLink}
          size="small"
          href={`/forms/${form.id}/answers/`}
        >
          回答一覧
        </Button>
      </CardActions>
    </Card>
  );
};

interface FormsViewProps {
  initialForms: GetFormsPageResponse;
}

const FormsView = ({ initialForms }: FormsViewProps) => {
  const {
    items: forms,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = useInfiniteApiQuery(
    '/api/v1/forms',
    (cursor) => ({ query: cursor === undefined ? {} : { cursor } }),
    initialForms
  );

  return (
    <Box sx={{ width: '100%' }}>
      {forms.length === 0 ? (
        <Alert severity="warning">
          <AlertTitle>フォームがありません</AlertTitle>
          現在回答可能なフォームがありません
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {forms.map((form) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={form.id}>
              <EachForm form={form} />
            </Grid>
          ))}
        </Grid>
      )}
      {hasMore && (
        <InfiniteScrollSentinel
          sentinelRef={sentinelRef}
          isLoadingMore={isLoadingMore}
        />
      )}
    </Box>
  );
};

export default FormsView;
