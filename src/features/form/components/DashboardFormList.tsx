'use client';

import Add from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { formatString } from '../../../components/DateFormatter';
import type { MinimumForm } from '@/_schemas/formSchema';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface Props {
  forms: MinimumForm[];
}

const formatResponsePeriod = (startAt: string | null, endAt: string | null) => {
  if (startAt != null && endAt != null) {
    return `回答可能期間: ${formatString(startAt)} ~ ${formatString(endAt)}`;
  } else {
    return `回答期限なし`;
  }
};

export const Forms = ({ forms }: Props) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {forms.map((form, index) => {
          return (
            <Grid item key={index}>
              <Item>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {form.title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {formatResponsePeriod(
                        form.response_period.start_at,
                        form.response_period.end_at
                      )}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" href={`/admin/forms/edit/${form.id}`}>
                      EDIT
                    </Button>
                    <Button size="small">CLOSE</Button>
                  </CardActions>
                </Card>
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export const CreateFormButton = () => {
  return (
    <Button variant="contained" startIcon={<Add />} href="/admin/forms/create">
      NEW
    </Button>
  );
};
