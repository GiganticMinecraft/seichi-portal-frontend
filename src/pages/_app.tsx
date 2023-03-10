/* eslint-disable react/jsx-props-no-spreading */
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type AppProps } from 'next/app';

import { queryClientConfig, customChakraTheme } from '@/config';
import { McProfileProvider } from '@/features/user/components/McProfileProvider';
import { isProduction } from '@/libs';

const queryClient = new QueryClient(queryClientConfig);

const App = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={customChakraTheme}>
      <McProfileProvider>
        <Component {...pageProps} />
      </McProfileProvider>
    </ChakraProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

if (!isProduction) {
  // Next.jsのqueryが2回呼ばれるので対処
  // See: https://zenn.dev/sora_kumo/articles/e86bbf0291d4a7
  App.getInitialProps = async () => ({ pageProps: {} });

  // mswのモックサーバーを実行する
  // See: https://chaika.hatenablog.com/entry/2021/08/30/083000
  const runMockServer = () => import('@/__mocks__/worker.js');
  runMockServer();
}

export default App;
