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
import { formatString } from '@/components/DateFormatter';
import { Link } from '@/components/Link';
import type { MinimumForm } from '../../../_schemas/formSchema';

const formatResponsePeriod = (startAt: string | null, endAt: string | null) => {
  if (startAt != null && endAt != null) {
    return `回答可能期間: ${formatString(startAt)} ~ ${formatString(endAt)}`;
  } else {
    return `回答期限なし`;
  }
};

const EachForm = ({ form }: { form: MinimumForm }) => {
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
  forms: MinimumForm[];
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
