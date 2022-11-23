import { Container, Heading } from '@chakra-ui/react';
import React from 'react';

import { Helmet } from '../Helmet';

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export const ContentLayout = ({ title, description, children }: Props) => (
  <>
    <Helmet title={title} description={description} />
    <Container maxW="90ch">
      <Heading as="h1" size="xl" my="3">
        {title}
      </Heading>
      {children}
    </Container>
  </>
);
