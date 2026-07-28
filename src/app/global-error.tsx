'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ja">
      <body>
        <p>予期しないエラーが発生しました。</p>
        <button type="button" onClick={reset}>
          再試行
        </button>
      </body>
    </html>
  );
};

export default GlobalError;
