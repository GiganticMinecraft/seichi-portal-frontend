import { type QueryClientConfig } from '@tanstack/react-query';

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true,
      // fetchして60秒（1000ms * 60）はcacheを読み込む
      staleTime: 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
};
