import { useColorMode } from '@chakra-ui/react';

import { Presenter, type ServerLogoProps } from './presenter';

type Props = Omit<ServerLogoProps, 'color'>;

export const ServerLogo = ({ width, height }: Props) => {
  const { colorMode } = useColorMode();
  const color = colorMode === 'light' ? 'dark' : 'light';

  return <Presenter {...{ color, width, height }} />;
};
