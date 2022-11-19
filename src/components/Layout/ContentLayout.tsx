import { Container, Heading } from '@chakra-ui/react';
import React from 'react';

import { Helmet } from '../Helmet';

type Props = {
  title: string;
  children: React.ReactNode;
};

export const ContentLayout = ({ title, children }: Props) => (
  <>
    <Helmet title={title} />
    <Container maxW="120ch">
      <Heading as="h1" size="2xl" mb="2">
        {title}
      </Heading>
      {children}
    </Container>
  </>
);
