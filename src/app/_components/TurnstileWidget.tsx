'use client';

import { Box, type SxProps, type Theme } from '@mui/material';
import type { RefCallback } from 'react';

type Props = {
  containerRef: RefCallback<HTMLDivElement>;
  sx?: SxProps<Theme>;
};

/**
 * Cloudflare Turnstile のウィジェット用コンテナ。
 * `appearance: 'interaction-only'` のため通常時は何も描画されず、
 * challenge が要求された場合のみチェックボックスが現れ、解決すると
 * 自動的に消える(コンテナが再び width/height 0 に戻る)。
 * 画面内のどこに表示するかは呼び出し側のレイアウトに属する関心事なので、
 * `sx` として呼び出し側から渡してもらう。
 */
export const TurnstileWidget = ({ containerRef, sx }: Props) => (
  <Box sx={sx}>
    <div ref={containerRef} />
  </Box>
);
