import { ColorMode, IconButton, type IconButtonProps } from '@chakra-ui/react';
import { FaRegMoon, FaRegSun } from 'react-icons/fa';

type Props = {
  currentColorMode: ColorMode;
  toggleColorMode?: () => void;
};

export type ToggleColorModeProps = Omit<
  IconButtonProps,
  'aria-label' | 'icon' | 'onClick'
>;

export const Presenter = ({
  currentColorMode: colorMode,
  toggleColorMode = () => undefined,
  ...props
}: Props & ToggleColorModeProps) => (
  <IconButton
    onClick={toggleColorMode}
    aria-label="カラーモードを切り替える"
    icon={
      colorMode === 'light' ? (
        <FaRegMoon data-testid="toggle-icon-moon" />
      ) : (
        <FaRegSun data-testid="toggle-icon-sun" />
      )
    }
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);
