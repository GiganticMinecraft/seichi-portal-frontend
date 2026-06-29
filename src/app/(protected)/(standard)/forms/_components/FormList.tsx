'use client';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Link,
  Typography,
  Alert,
  AlertTitle,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NextLink from 'next/link';
import {
  formatResponsePeriod,
  toResponsePeriod,
} from '@/lib/forms/responsePeriod';
import type { GetFormsResponse } from '@/lib/api-types';

type FormItem = GetFormsResponse[number];

const EachForm = ({ form }: { form: FormItem }) => {
  const responsePeriod = toResponsePeriod(
    form.settings.answer_settings?.acceptance_period
  );

  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Link
          component={NextLink}
          href={`/forms/${form.id}`}
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {form.title}
          </Typography>
        </Link>
        <Chip
          icon={<AccessTimeIcon />}
          label={formatResponsePeriod(responsePeriod)}
          size="small"
          variant="outlined"
          sx={{ mb: 1.5 }}
        />
        {form.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {form.description}
          </Typography>
        )}
      </CardContent>
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

interface Props {
  forms: GetFormsResponse;
}

const FormList = ({ forms }: Props) => {
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
    </Box>
  );
};

export default FormList;
