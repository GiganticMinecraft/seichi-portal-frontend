'use client';

import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { type MouseEvent, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import ConfirmDialog from './ConfirmDialog';

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

const isExternalHttpLink = (href: string | undefined): href is string =>
  href !== undefined && /^https?:\/\//i.test(href);

/**
 * Markdown 本文を描画する共通 component。
 * img 要素はトラッキングピクセル等の情報漏洩対策として一律描画せず、alt テキストのみ表示する。
 * a 要素は tabnabbing 対策として新しいタブで開く。
 * また、リンク文言と実際の遷移先を偽装される(例: `[https://example.com](https://evil.example)`)
 * リスクに備え、外部(http/https)リンクのクリック時のみ実際の遷移先 URL を提示する確認ダイアログを
 * 挟んでから遷移する。相対パスやページ内アンカーなど同一オリジンへの内部リンクは対象外とする。
 */
const MarkdownText = ({ children, sx }: Props) => {
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const handleLinkClick =
    (href: string | undefined) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isExternalHttpLink(href)) return;
      event.preventDefault();
      setPendingHref(href);
    };

  return (
    <Box sx={sx ? [defaultSx, sx].flat() : defaultSx}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ alt }) => <>{alt ? `[image: ${alt}]` : '[image]'}</>,
          a: ({ href, children: linkChildren }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick(href)}
            >
              {linkChildren}
            </a>
          ),
        }}
      >
        {children}
      </Markdown>
      <ConfirmDialog
        open={pendingHref !== null}
        title="外部サイトに移動します"
        description={
          <>
            表示されているリンク文言と実際の遷移先が異なる場合があります。以下の遷移先を確認のうえ移動してください。
            <Typography
              component="span"
              sx={{ display: 'block', wordBreak: 'break-all', mt: 1 }}
            >
              {pendingHref}
            </Typography>
          </>
        }
        confirmLabel="移動する"
        pending={false}
        onConfirm={() => {
          if (pendingHref) {
            window.open(pendingHref, '_blank', 'noopener,noreferrer');
          }
          setPendingHref(null);
        }}
        onCancel={() => {
          setPendingHref(null);
        }}
      />
    </Box>
  );
};

export default MarkdownText;
