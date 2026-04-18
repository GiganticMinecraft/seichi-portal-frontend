'use client';

import { useEffect } from 'react';
import ErrorModal from '@/app/_components/ErrorModal';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorModal error={error} onRetry={reset} />;
};

export default ErrorPage;
