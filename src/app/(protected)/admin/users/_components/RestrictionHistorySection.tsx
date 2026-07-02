'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import { useApiQuery } from '@/app/_swr/useApiQuery';
import { formatString } from '@/generic/DateFormatter';
import {
  formatRestrictionExpiration,
  toRestrictionExpiration,
} from '@/lib/restrictions/expiration';

const RestrictionHistorySection = ({ uuid }: { uuid: string }) => {
  const {
    data: history,
    error,
    isLoading,
  } = useApiQuery('/api/v1/users/{uuid}/answer-submitter-restriction/history', {
    path: { uuid },
  });

  const count = history?.length ?? 0;

  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2" component="h3">
          処罰履歴（{count}件）
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {error && (
          <Alert severity="error">処罰履歴の取得に失敗しました。</Alert>
        )}
        {history && count === 0 && (
          <Typography variant="body2" component="p" color="text.secondary">
            処罰履歴はありません
          </Typography>
        )}
        {history && count > 0 && (
          <Stack divider={<Divider />} spacing={1.5}>
            {history.map((item) => {
              const expiration = toRestrictionExpiration(item.expires_at);

              return (
                <Stack key={item.id} spacing={0.5}>
                  <Typography component="p">
                    <strong>理由:</strong> {item.reason}
                  </Typography>
                  <Typography component="p">
                    <strong>制限日時:</strong>{' '}
                    {formatString(item.restricted_at)}
                  </Typography>
                  <Typography component="p">
                    <strong>解除予定:</strong>{' '}
                    {formatRestrictionExpiration(expiration)}
                  </Typography>
                  <Typography component="p">
                    <strong>状態:</strong>{' '}
                    {item.lifted_at
                      ? `解除済み（${formatString(item.lifted_at)}）`
                      : '制限中'}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default RestrictionHistorySection;
