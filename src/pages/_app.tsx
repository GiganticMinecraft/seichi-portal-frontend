/* eslint-disable react/jsx-props-no-spreading */
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type AppProps } from 'next/app';

import { queryClientConfig, customChakraTheme } from '@/config';
import { MsalProvider } from '@/features/user/components/MsalProvider';

const queryClient = new QueryClient(queryClientConfig);

const App = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={customChakraTheme}>
      <MsalProvider>
        <Component {...pageProps} />
      </MsalProvider>
    </ChakraProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

// https://zenn.dev/sora_kumo/articles/e86bbf0291d4a7
if (process.env.NODE_ENV !== 'production') {
  App.getInitialProps = async () => ({ pageProps: {} });
}

export default App;
