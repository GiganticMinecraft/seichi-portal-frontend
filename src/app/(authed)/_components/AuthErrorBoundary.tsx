'use client';

import { useEffect } from 'react';
import ErrorModal from '@/app/_components/ErrorModal';

type AuthErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const AuthErrorBoundary = ({ error, reset }: AuthErrorBoundaryProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorModal error={error} onRetry={reset} />;
};

export default AuthErrorBoundary;
