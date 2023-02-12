import { Box } from '@chakra-ui/react';

import { ServerLogo } from '../ServerLogo';
import { ToggleColorMode } from '../ToggleColorMode';

export const Header = () => (
  <Box
    boxShadow="md"
    p={3}
    display="flex"
    justifyContent={{ base: 'space-between', md: 'center' }}
    alignItems="center"
    position="relative"
  >
    <ServerLogo width={120} />
    <Box
      position={{ base: 'relative', md: 'absolute' }}
      right={{ base: 0, md: 40 }}
    >
      <ToggleColorMode />
    </Box>
  </Box>
);
