'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  styled,
  Paper,
  Stack,
  Alert,
  AlertTitle,
} from '@mui/material';
import dayjs, { extend } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Link } from '@/components/Link';
import type { Form } from '../types/formSchema';

extend(timezone);
extend(utc);
dayjs.tz.setDefault('Asia/Tokyo');

const formatResponsePeriod = (startAt: string | null, endAt: string | null) => {
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
};

const EachForm = ({ form }: { form: Form }) => {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div">
            {form.title}
          </Typography>
          <Typography color="text.secondary">
            {formatResponsePeriod(
              form.settings.response_period.start_at,
              form.settings.response_period.end_at
            )}
          </Typography>
          {form.description && (
            <Typography sx={{ marginTop: 1.5 }} variant="body2">
              {form.description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

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

const FormList = ({ forms }: Props) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        {forms.length === 0 ? (
          <Alert severity="warning">
            <AlertTitle>フォームがありません</AlertTitle>
            現在回答可能なフォームがありません
          </Alert>
        ) : (
          forms.map((form) => {
            return (
              <Link href={`/forms/${form.id}`} key={form.id}>
                <Item>
                  <EachForm form={form} />
                </Item>
              </Link>
            );
          })
        )}
      </Stack>
    </Box>
  );
};

export default FormList;
