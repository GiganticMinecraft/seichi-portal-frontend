/* eslint-disable react/jsx-props-no-spreading */
import { ChakraProvider } from '@chakra-ui/react';

import { MainLayout } from '@/components/Layout';

import type { AppProps } from 'next/app';

if (process.env.NODE_ENV === 'development') {
  const MockServer = () => import('@/__mocks__/worker');
  MockServer();
}

const App = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider>
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  </ChakraProvider>
);

export default App;
