/* eslint-disable react/jsx-props-no-spreading */
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type AppProps } from 'next/app';

import { customTheme } from '@/config/customTheme';
import { queryClientConfig } from '@/config/queryClientConfig';

const queryClient = new QueryClient(queryClientConfig);

const App = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={customTheme}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </ChakraProvider>
  </QueryClientProvider>
);

// https://zenn.dev/sora_kumo/articles/e86bbf0291d4a7
if (process.env.NODE_ENV !== 'production') {
  App.getInitialProps = async () => ({ pageProps: {} });
}

export default App;
