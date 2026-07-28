'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';

import MinecraftPunishmentList from '@/app/(protected)/_components/MinecraftPunishmentList';
import { useApiQuery } from '@/app/_swr/useApiQuery';

const MinecraftPunishmentHistorySection = ({ uuid }: { uuid: string }) => {
  const {
    data: history,
    error,
    isLoading,
  } = useApiQuery('/api/v1/users/{uuid}/minecraft-punishments', {
    path: { uuid },
  });

  const count = history?.length ?? 0;

  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2" component="h3">
          Minecraft BAN履歴（{count}件）
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {error && (
          <Alert severity="error">
            Minecraft BAN履歴の取得に失敗しました。
          </Alert>
        )}
        {history && <MinecraftPunishmentList punishments={history} />}
      </AccordionDetails>
    </Accordion>
  );
};

export default MinecraftPunishmentHistorySection;
