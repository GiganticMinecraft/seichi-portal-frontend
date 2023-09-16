'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Form } from '@/schemas/formSchema';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault('Asia/Tokyo');

function formResponsePeriodToString(
  startAt: string | null,
  endAt: string | null
) {
  if (startAt != null && endAt != null) {
    const formatString = 'YYYY年MM月DD日 HH時mm分';

    const startDateTime = dayjs(new Date(startAt))
      .tz('Asia/Tokyo')
      .format(formatString);

    const endDateTime = dayjs(new Date(endAt))
      .tz('Asia/Tokyo')
      .format(formatString);

    return `回答可能期間: ${startDateTime} ~ ${endDateTime}`;
  } else {
    return `回答期限なし`;
  }
}

function OutlinedCard({ form }: { form: Form }) {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div">
            {form.title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {formResponsePeriodToString(
              form.settings.response_period.start_at,
              form.settings.response_period.end_at
            )}
          </Typography>
          <Typography variant="body2">{form.description}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface Props {
  forms: Form[];
}

export default function Forms({ forms }: Props) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {forms.map((form) => {
          return (
            <Link href={`/forms/${form.id}`} key={form.id}>
              <Item>
                <OutlinedCard form={form} />
              </Item>
            </Link>
          );
        })}
      </Stack>
    </Box>
  );
}
