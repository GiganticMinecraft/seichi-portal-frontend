import { Box } from '@chakra-ui/react';

import { ServerLogo } from '../ServerLogo';

export const Header = () => (
  <Box
    boxShadow="md"
    py={3}
    display="flex"
    justifyContent="center"
    position="relative"
  >
    <ServerLogo width={120} height={100} color="dark" />
  </Box>
);
