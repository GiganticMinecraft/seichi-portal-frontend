'use client';

import { useSearchParams } from 'next/navigation';
import ErrorDialog from '@/app/_components/ErrorDialog';
import { HttpError } from '@/lib/httpError';

const AccessErrorOverlay = () => {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  if (!errorParam) return null;

  const status = parseInt(errorParam, 10);
  if (isNaN(status)) return null;

  const error = new HttpError({ status, message: '', url: '' });
  return <ErrorDialog error={error} />;
};

export default AccessErrorOverlay;
