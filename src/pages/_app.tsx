/* eslint-disable react/jsx-props-no-spreading */
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { MainLayout } from '@/components/Layout';

import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  if (router.pathname === '/_error')
    return (
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    );

  return (
    <ChakraProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ChakraProvider>
  );
};

export default App;
