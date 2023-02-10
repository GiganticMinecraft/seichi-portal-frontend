import { Container, Heading } from '@chakra-ui/react';

import { Header } from '../Header';
import { Helmet, type HelmetProps } from '../Helmet';

type Props = {
  children: React.ReactNode;
};

export const Layout = ({
  children,
  title,
  description,
}: Props & HelmetProps) => (
  <>
    <header>
      <Header />
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