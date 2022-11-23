import { Box, Button } from '@chakra-ui/react';

import { NextLink } from '../NextLink';
import { ServerLogo } from '../ServerLogo';

export const Header = () => (
  <Box bg="cyan.300" py="3" textAlign="center">
    <Button variant="link">
      <NextLink href="/">
        <ServerLogo width={110} height={100} color="dark" />
      </NextLink>
    </Button>
  </Box>
);
