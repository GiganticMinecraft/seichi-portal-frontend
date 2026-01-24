'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { formatString } from '../../../../../generic/DateFormatter';
import type { GetFormsResponse } from '@/app/api/_schemas/ResponseSchemas';

interface Props {
  forms: GetFormsResponse;
}

const formatResponsePeriod = (startAt: string | null, endAt: string | null) => {
  if (startAt != null && endAt != null) {
    return `${formatString(startAt)} ~ ${formatString(endAt)}`;
  } else {
    return `回答期限なし`;
  }
};

export const Forms = ({ forms }: Props) => {
  const deleteForm = async (formId: string) => {
    if (confirm('本当に削除しますか？')) {
      const response = await fetch(`/api/proxy/forms/${formId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('削除しました');
      } else {
        alert('削除に失敗しました');
      }
    }
  };

  return (
    <Grid container spacing={2}>
      {forms.map((form, index) => {
        return (
          <Grid key={index}>
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
                <Button size="small" onClick={() => deleteForm(form.id)}>
                  DELETE
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
