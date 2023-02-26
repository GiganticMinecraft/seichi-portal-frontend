import { Container, Heading } from '@chakra-ui/react';

import { MsalProvider } from '@/features/user/components/MsalProvider';

import { Header } from '../Header';
import { Helmet, type HelmetProps } from '../Helmet';

type Props = {
  children: React.ReactNode;
  title: string;
};

export const Layout = ({
  children,
  title,
  description,
}: Props & Omit<HelmetProps, 'title'>) => (
  <>
    <header>
      <MsalProvider>
        <Header />
      </MsalProvider>
    </header>
    <main>
      <Helmet {...{ title, description }} />
      <Container my={2}>
        <Heading as="h1" size="xl" mb="3">
          {title}
        </Heading>
        {children}
      </Container>
    </main>
  </>
);
