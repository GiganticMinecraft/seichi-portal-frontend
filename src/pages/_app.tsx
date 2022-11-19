/* eslint-disable react/jsx-props-no-spreading */
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { MainLayout } from '@/components/Layout';

import type { AppProps } from 'next/app';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontSize: 'xl',
      },
    },
  },
});

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  if (router.pathname === '/_error')
    return (
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    );

  return (
    <ChakraProvider theme={theme}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ChakraProvider>
  );
};

export default App;
