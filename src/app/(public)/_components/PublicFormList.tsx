import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';

import type { GetFormsResponse } from '@/lib/api-types';
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
      <CardActionArea
        component={NextLink}
        href={`/forms/${form.id}`}
        sx={{ height: '100%' }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h3" gutterBottom>
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
      </CardActionArea>
    </Card>
  );
};

type Props = {
  forms: GetFormsResponse;
};

export const PublicFormList = ({ forms }: Props) => (
  <Grid container spacing={3}>
    {forms.map((form) => (
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={form.id}>
        <EachForm form={form} />
      </Grid>
    ))}
  </Grid>
);
