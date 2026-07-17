'use client';

import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const defaultSx: SxProps<Theme> = {
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

type Props = {
  children: string;
  sx?: SxProps<Theme>;
};

/**
 * Markdown 本文を描画する共通 component。
 * img 要素はトラッキングピクセル等の情報漏洩対策として一律描画せず、alt テキストのみ表示する。
 */
const MarkdownText = ({ children, sx }: Props) => {
  return (
    <Box sx={sx ? [defaultSx, sx].flat() : defaultSx}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ alt }) => <>{alt ? `[image: ${alt}]` : '[image]'}</>,
        }}
      >
        {children}
      </Markdown>
    </Box>
  );
};

export default MarkdownText;
