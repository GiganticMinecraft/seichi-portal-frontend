import { Box, Button } from '@chakra-ui/react';
import Link from 'next/link';

import { ServerLogo } from '../ServerLogo';

export const Header = () => (
  <Box bg="cyan.300" py="3" textAlign="center">
    <Button variant="link">
      <Link href="/">
        <ServerLogo boxSize="md" color="dark" />
      </Link>
    </Button>
  </Box>
);
