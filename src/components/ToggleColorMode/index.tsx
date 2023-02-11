import { useColorMode } from '@chakra-ui/react';

import { Presenter } from './presenter';

export const ToggleColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return <Presenter {...{ colorMode, toggleColorMode }} />;
};
