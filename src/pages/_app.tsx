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

// https://zenn.dev/sora_kumo/articles/e86bbf0291d4a7
if (!isProduction) {
  App.getInitialProps = async () => ({ pageProps: {} });
}

export default App;
