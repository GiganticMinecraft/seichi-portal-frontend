'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { formatString } from '../../../../../generic/DateFormatter';
import type { MinimumForm } from '@/_schemas/formSchema';

interface Props {
  forms: MinimumForm[];
}

const formatResponsePeriod = (startAt: string | null, endAt: string | null) => {
  if (startAt != null && endAt != null) {
    return `${formatString(startAt)} ~ ${formatString(endAt)}`;
  } else {
    return `回答期限なし`;
  }
};

export const Forms = ({ forms }: Props) => {
  return (
    <Grid container spacing={2}>
      {forms.map((form, index) => {
        return (
          <Grid item key={index}>
            <Card
              sx={{
                width: 320,
                height: 170,
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {form.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: 'gray' }}>
                  {formatResponsePeriod(
                    form.response_period.start_at,
                    form.response_period.end_at
                  )}
                </Typography>
              </CardContent>
              <CardActions sx={{ marginTop: 'auto' }}>
                <Button size="small" href={`/admin/forms/edit/${form.id}`}>
                  EDIT
                </Button>
                <Button size="small">CLOSE</Button>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
