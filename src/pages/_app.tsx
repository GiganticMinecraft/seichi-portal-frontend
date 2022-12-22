/* eslint-disable react/jsx-props-no-spreading */
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { MainLayout } from '@/components/Layout';

import type { AppProps } from 'next/app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true,
      // fetchして1分間はcacheを読み込む
      staleTime: 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});

const App = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      <ReactQueryDevtools initialIsOpen={false} />
    </ChakraProvider>
  </QueryClientProvider>
);

// https://zenn.dev/sora_kumo/articles/e86bbf0291d4a7
if (process.env.NODE_ENV !== 'production') {
  App.getInitialProps = async () => ({ pageProps: {} });
}

export default App;
