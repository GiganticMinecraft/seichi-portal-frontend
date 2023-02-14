import { Box, ButtonGroup } from '@chakra-ui/react';

import { SignIn } from '@/features/user/components/SignIn';
import { SignOut } from '@/features/user/components/SignOut';

import { ServerLogo } from '../ServerLogo';
import { ToggleColorMode } from '../ToggleColorMode';

type Props = {
  isAuthenticated: boolean;
};

export const Presenter = ({ isAuthenticated }: Props) => (
  <Box
    boxShadow="md"
    p={3}
    display="flex"
    justifyContent={{ base: 'space-between', md: 'center' }}
    alignItems="center"
    position="relative"
  >
    <ServerLogo width={120} />
    <ButtonGroup
      position={{ base: 'relative', md: 'absolute' }}
      right={{ base: 0, md: 40 }}
    >
      <ToggleColorMode />
      {isAuthenticated ? <SignOut /> : <SignIn />}
    </ButtonGroup>
  </Box>
);
