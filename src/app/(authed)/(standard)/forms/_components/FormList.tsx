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
import { formatString } from '@/generic/DateFormatter';
import type { GetFormsResponse } from '@/lib/api-types';

const formatResponsePeriod = (startAt: string | null, endAt: string | null) => {
  if (startAt != null && endAt != null) {
    return `${formatString(startAt)} ~ ${formatString(endAt)}`;
  }
  return '回答期限なし';
};

type FormItem = GetFormsResponse[number];

const EachForm = ({ form }: { form: FormItem }) => {
  const responsePeriod = form.settings.answer_settings?.response_period ?? null;

  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Link
          href={`/forms/${form.id}`}
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {form.title}
          </Typography>
        </Link>
        <Chip
          icon={<AccessTimeIcon />}
          label={formatResponsePeriod(
            responsePeriod?.start_at ?? null,
            responsePeriod?.end_at ?? null
          )}
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
        <Button size="small" href={`/forms/${form.id}/answers/`}>
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
