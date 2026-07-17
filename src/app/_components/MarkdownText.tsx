'use client';

import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const defaultSx: SxProps<Theme> = {
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  // ブラウザ既定の p マージンをリセットし、単一段落表示時の意図しない余白を防ぐ。
  // 複数段落がある場合のみ段落間に間隔を持たせる。
  '& p': { margin: 0 },
  '& p + p': { marginTop: '0.5em' },
};

type Props = {
  children: string;
  sx?: SxProps<Theme>;
};

/**
 * Markdown 本文を描画する共通 component。
 * img 要素はトラッキングピクセル等の情報漏洩対策として一律描画せず、alt テキストのみ表示する。
 * a 要素は tabnabbing 対策として新しいタブで開く。
 */
const MarkdownText = ({ children, sx }: Props) => {
  return (
    <Box sx={sx ? [defaultSx, sx].flat() : defaultSx}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ alt }) => <>{alt ? `[image: ${alt}]` : '[image]'}</>,
          a: ({ href, children: linkChildren }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {linkChildren}
            </a>
          ),
        }}
      >
        {children}
      </Markdown>
    </Box>
  );
};

export default MarkdownText;
