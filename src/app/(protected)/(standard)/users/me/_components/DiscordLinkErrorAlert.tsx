'use client';

import { Alert } from '@mui/material';

import { useClearQueryParam } from '@/app/(protected)/_components/useClearQueryParam';
import { DISCORD_LINK_ERROR_QUERY } from '@/lib/discordLinkError';

/**
 * Discord 連携の失敗を伝える Alert。閉じると URL からクエリパラメータを取り除き、
 * 再読み込みや URL の共有で同じ文言が出続けないようにする。
 */
const DiscordLinkErrorAlert = ({ message }: { message: string }) => {
  const clearQueryParam = useClearQueryParam();

  return (
    <Alert
      severity="error"
      onClose={() => {
        clearQueryParam(DISCORD_LINK_ERROR_QUERY);
      }}
    >
      {message}
    </Alert>
  );
};

export default DiscordLinkErrorAlert;
