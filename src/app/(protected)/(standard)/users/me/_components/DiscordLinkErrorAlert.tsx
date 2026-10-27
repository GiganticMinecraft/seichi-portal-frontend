'use client';

import { Alert } from '@mui/material';
import { useState } from 'react';

import { DISCORD_LINK_ERROR_QUERY } from '@/lib/discordLinkError';

/**
 * Discord 連携の失敗を伝える Alert。
 *
 * 閉じたら URL からクエリパラメータを取り除き、再読み込みや URL の共有で同じ文言が
 * 出続けないようにする。`router.replace` だとサーバーコンポーネントの再描画で backend への
 * 問い合わせが走るため、履歴の書き換えだけで済ませる (Next.js は `history.replaceState` を
 * `useSearchParams` に同期する)。
 */
const DiscordLinkErrorAlert = ({ message }: { message: string }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <Alert
      severity="error"
      onClose={() => {
        setDismissed(true);
        const url = new URL(window.location.href);
        url.searchParams.delete(DISCORD_LINK_ERROR_QUERY);
        window.history.replaceState(null, '', url);
      }}
    >
      {message}
    </Alert>
  );
};

export default DiscordLinkErrorAlert;
