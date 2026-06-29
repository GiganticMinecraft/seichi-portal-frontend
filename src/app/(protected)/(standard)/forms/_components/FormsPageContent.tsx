import { Box, Typography } from '@mui/material';
import FormsView from './FormsView';
import type { GetFormsResponse } from '@/lib/api-types';

const FormsPageContent = ({ forms }: { forms: GetFormsResponse }) => (
  <Box sx={{ width: '100%' }}>
    <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
      フォーム一覧
    </Typography>
    <FormsView forms={forms} />
  </Box>
);

export default FormsPageContent;
