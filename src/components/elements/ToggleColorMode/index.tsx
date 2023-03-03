import { useColorMode } from '@chakra-ui/react';

import { Presenter, type PresenterProps } from './presenter';

type Props = Omit<PresenterProps, 'currentColorMode' | 'toggleColorMode'>;

export const ToggleColorMode = (props: Props) => {
  const { colorMode: currentColorMode, toggleColorMode } = useColorMode();

  return (
    <Presenter
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      {...{ currentColorMode, toggleColorMode }}
    />
  );
};
