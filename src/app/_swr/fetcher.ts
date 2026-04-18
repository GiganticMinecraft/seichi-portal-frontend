import { HttpError } from '@/lib/httpError';

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new HttpError({
      message: `Request failed: ${res.status}`,
      status: res.status,
      url,
    });
  }

  return res.json();
};
