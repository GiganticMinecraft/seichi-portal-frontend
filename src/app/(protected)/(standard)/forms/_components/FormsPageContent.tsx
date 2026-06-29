import { Box, Typography } from '@mui/material';

import type { GetFormsResponse } from '@/lib/api-types';

import FormsView from './FormsView';

const FormsPageContent = ({ forms }: { forms: GetFormsResponse }) => (
  <Box sx={{ width: '100%' }}>
    <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
      フォーム一覧
    </Typography>
    <FormsView forms={forms} />
  </Box>
);

export default FormsPageContent;
