import { Alert, Box, CircularProgress } from '@mui/material';

const RestrictionStatusFeedback = ({
  error,
  isLoading,
}: {
  error: unknown;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">制限状態の取得に失敗しました。</Alert>;
  }

  return null;
};

export default RestrictionStatusFeedback;
