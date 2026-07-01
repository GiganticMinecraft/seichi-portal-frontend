import { Box, CircularProgress } from '@mui/material';

/** 無限スクロールで次ページ読み込みをトリガーする監視対象領域 */
const InfiniteScrollSentinel = ({
  sentinelRef,
  isLoadingMore,
}: {
  sentinelRef: React.RefObject<HTMLDivElement | null>;
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
