import { ColorMode, IconButton, type IconButtonProps } from '@chakra-ui/react';
import { FaRegMoon, FaRegSun } from 'react-icons/fa';

export type PresenterProps = {
  currentColorMode: ColorMode;
  toggleColorMode?: () => void;
} & Omit<IconButtonProps, 'aria-label'>;

export const Presenter = ({
  currentColorMode,
  toggleColorMode: onClick,
  ...props
}: PresenterProps) => {
  const icon =
    currentColorMode === 'light' ? (
      <FaRegMoon data-testid="toggle-icon-moon" />
    ) : (
      <FaRegSun data-testid="toggle-icon-sun" />
    );

  return (
    <IconButton
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      {...{ onClick, icon }}
      aria-label="カラーモードを切り替える"
    />
  );
};
