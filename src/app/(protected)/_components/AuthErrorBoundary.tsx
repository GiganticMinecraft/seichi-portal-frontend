'use client';

import { useEffect } from 'react';
import ErrorDialog from '@/app/_components/ErrorDialog';

type AuthErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const AuthErrorBoundary = ({ error, reset }: AuthErrorBoundaryProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorDialog error={error} onRetry={reset} />;
};

export default AuthErrorBoundary;
