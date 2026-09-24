'use client';

import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { type MouseEvent, useState } from 'react';
import Markdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import ConfirmDialog from './ConfirmDialog';

const defaultSx: SxProps<Theme> = (theme) => ({
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  // ブラウザ既定の p マージンをリセットし、単一段落表示時の意図しない余白を防ぐ。
  // 複数段落がある場合のみ段落間に間隔を持たせる。
  '& p': { margin: 0 },
  '& p + p': { marginTop: '0.5em' },
  // 全体の CSS リセットで消えた余白を戻し、番号や記号が本文の左端からはみ出すのを防ぐ。
  '& ol, & ul': { paddingInlineStart: '2em' },
  '& code': {
    backgroundColor: '#e8eef5',
    color: theme.palette.text.primary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#343434',
      color: '#FFFFFF',
    }),
  },
  '& pre': {
    backgroundColor: '#e8eef5',
    color: theme.palette.text.primary,
    borderRadius: 1,
    padding: 1.5,
    maxWidth: '100%',
    overflowX: 'auto',
    whiteSpace: 'pre',
    wordBreak: 'normal',
    ...theme.applyStyles('dark', {
      backgroundColor: '#343434',
      color: '#FFFFFF',
    }),
  },
  '& pre code': {
    backgroundColor: 'transparent',
    color: 'inherit',
    padding: 0,
  },
  '&:has(> blockquote)': {
    borderLeft: '0.3em solid',
    borderColor: 'primary.main',
    margin: '10px auto',
    padding: '15px',
    borderRadius: '5px',
  },
  '& blockquote p::before': { content: '"“"' },
  '& blockquote p::after': { content: '"”"' },
  '& blockquote + p': { textAlign: 'right' },
});

type Props = {
  children: string;
  sx?: SxProps<Theme>;
};

const imageComponent: Components['img'] = ({ alt }) => (
  <>{alt ? `[image: ${alt}]` : '[image]'}</>
);

const previewComponents: Components = {
  img: imageComponent,
  a: ({ children }) => <span>{children}</span>,
  input: ({ checked }) => <>{checked ? '[x]' : '[ ]'}</>,
};

const MarkdownBody = ({
  children,
  components,
  sx,
}: Props & { components: Components }) => (
  <Box sx={sx ? [defaultSx, sx].flat() : defaultSx}>
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </Markdown>
  </Box>
);

const isExternalHttpLink = (
  href: string | undefined,
  currentOrigin: string
): href is string => {
  if (href === undefined || !/^https?:\/\//i.test(href)) return false;

  try {
    return new URL(href).origin !== currentOrigin;
  } catch {
    return false;
  }
};

/**
 * Markdown 本文を描画する共通 component。
 * img 要素はトラッキングピクセル等の情報漏洩対策として一律描画せず、alt テキストのみ表示する。
 * a 要素は tabnabbing 対策として新しいタブで開く。
 * また、リンク文言と実際の遷移先を偽装される(例: `[https://example.com](https://evil.example)`)
 * リスクに備え、外部(http/https)リンクのクリック時のみ実際の遷移先 URL を提示する確認ダイアログを
 * 挟んでから遷移する。相対パスやページ内アンカーなど同一オリジンへの内部リンクは対象外とする。
 * ホイールクリック(中クリック)は click イベントではなく auxclick イベントとして発火するため、
 * onAuxClick でも同様に確認ダイアログを挟む。
 */
const MarkdownText = ({ children, sx }: Props) => {
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const handleLinkClick =
    (href: string | undefined) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isExternalHttpLink(href, window.location.origin)) return;
      event.preventDefault();
      setPendingHref(href);
    };

  const handleLinkAuxClick =
    (href: string | undefined) => (event: MouseEvent<HTMLAnchorElement>) => {
      // ホイールクリック(中クリック)以外の auxclick(右クリック等)は対象外とする
      if (event.button !== 1) return;
      if (!isExternalHttpLink(href, window.location.origin)) return;
      event.preventDefault();
      setPendingHref(href);
    };

  return (
    <>
      <MarkdownBody
        {...(sx === undefined ? {} : { sx })}
        components={{
          img: imageComponent,
          a: ({ href, children: linkChildren }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick(href)}
              onAuxClick={handleLinkAuxClick(href)}
            >
              {linkChildren}
            </a>
          ),
        }}
      >
        {children}
      </MarkdownBody>
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
    </>
  );
};

/**
 * リンクカードなど、操作できる要素の内側に置く Markdown プレビュー。
 * リンクとチェック項目は操作できる要素にせず、文字として描画する。
 */
export const MarkdownPreview = ({ children, sx }: Props) => (
  <MarkdownBody
    {...(sx === undefined ? {} : { sx })}
    components={previewComponents}
  >
    {children}
  </MarkdownBody>
);

export default MarkdownText;
