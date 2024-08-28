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
  Link,
  CardActions,
  Button,
} from '@mui/material';
import { formatString } from '@/generic/DateFormatter';
import type { GetFormsResponse } from '@/app/api/_schemas/ResponseSchemas';

const formatResponsePeriod = (startAt: string | null, endAt: string | null) => {
  if (startAt != null && endAt != null) {
    return `回答可能期間: ${formatString(startAt)} ~ ${formatString(endAt)}`;
  } else {
    return `回答期限なし`;
  }
};

type Form = {
  id: number;
  title: string;
  description: string;
  response_period: {
    start_at: string;
    end_at: string;
  };
  answer_visibility: 'PUBLIC' | 'PRIVATE';
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
              form.response_period.start_at,
              form.response_period.end_at
            )}
          </Typography>
          {form.description && (
            <Typography sx={{ marginTop: 1.5 }} variant="body2">
              {form.description}
            </Typography>
          )}
        </CardContent>
        {form.answer_visibility === 'PUBLIC' ? (
          <CardActions>
            <Button size="small" href={`/forms/${form.id}/answers/`}>
              回答一覧
            </Button>
          </CardActions>
        ) : null}
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
  forms: GetFormsResponse;
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
              <Link
                href={`/forms/${form.id}`}
                key={form.id}
                sx={{ textDecoration: 'none' }}
              >
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
