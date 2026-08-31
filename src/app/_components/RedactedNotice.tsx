import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

/** フォームの回答詳細公開設定 (RESTRICTED) により、回答者本人には非表示にされている項目 */
const RedactedNotice = (props: TypographyProps) => (
  <Typography color="textSecondary" {...props}>
    非公開
  </Typography>
);

export default RedactedNotice;
