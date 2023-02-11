import { useColorMode } from '@chakra-ui/react';

import { Presenter, type PresenterProps } from './presenter';

type Props = Omit<PresenterProps, 'color'>;

export const ServerLogo = ({ width, height }: Props) => {
  const { colorMode } = useColorMode();
  const color = colorMode === 'light' ? 'dark' : 'light';

  return <Presenter {...{ color, width, height }} />;
};
