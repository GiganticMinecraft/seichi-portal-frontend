'use client';

import AuthErrorBoundary from '@/app/(protected)/_components/AuthErrorBoundary';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorPage = ({ error, reset }: ErrorPageProps) => (
  <AuthErrorBoundary error={error} reset={reset} />
);

export default ErrorPage;
