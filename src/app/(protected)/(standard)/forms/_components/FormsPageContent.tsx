import { Box, Typography } from '@mui/material';

import type { GetFormsPageResponse } from '@/lib/api-types';

import FormsView from './FormsView';

const FormsPageContent = ({
  initialForms,
}: {
  initialForms: GetFormsPageResponse;
}) => (
  <Box sx={{ width: '100%' }}>
    <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
      フォーム一覧
    </Typography>
    <FormsView initialForms={initialForms} />
  </Box>
);

export default FormsPageContent;
