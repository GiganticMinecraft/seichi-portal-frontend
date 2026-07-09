'use client';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

const CopyButton = ({
  value,
  label = 'コピー',
}: {
  /**
   * コピーする文字列。`window.location.origin` など、クリック時にしか安全に
   * 参照できない値が必要な場合は関数で渡すと、実際にクリックされるまで評価を遅延できる
   * (イベントハンドラは常にクライアント側でのみ実行されるため、Client Component の
   * SSR/hydration 時に `window is not defined` になる心配がない)。
   */
  value: string | (() => string);
  label?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = typeof value === 'function' ? value() : value;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <Tooltip title={copied ? 'コピーしました' : label} placement="top">
      <IconButton
        size="small"
        aria-label={label}
        onClick={() => {
          void handleCopy();
        }}
        sx={{ ml: 0.5 }}
      >
        <ContentCopyIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
