import { Box, CircularProgress } from '@mui/material';
import type { RefObject } from 'react';

/** 無限スクロールで次ページ読み込みをトリガーする監視対象領域 */
const InfiniteScrollSentinel = ({
  sentinelRef,
  isLoadingMore,
}: {
  sentinelRef: RefObject<HTMLDivElement | null>;
  isLoadingMore: boolean;
}) => {
  return (
    <Box
      ref={sentinelRef}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        py: 2,
        minHeight: 48,
      }}
    >
      {isLoadingMore && <CircularProgress size={24} />}
    </Box>
  );
};

export default InfiniteScrollSentinel;
