import { useColorMode } from '@chakra-ui/react';

import { Presenter, type PresenterProps } from './presenter';

type Props = Omit<PresenterProps, 'color'>;

export const ServerLogo = ({ width, ...props }: Props) => {
  const { colorMode } = useColorMode();
  const color = colorMode === 'light' ? 'dark' : 'light';

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Presenter {...props} {...{ color, width }} />;
};
