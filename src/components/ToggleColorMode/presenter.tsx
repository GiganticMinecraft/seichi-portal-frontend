import { ColorMode, IconButton } from '@chakra-ui/react';
import { FaRegMoon, FaRegSun } from 'react-icons/fa';

type Props = {
  currentColorMode: ColorMode;
  toggleColorMode?: () => void;
};

export const Presenter = ({
  currentColorMode: colorMode,
  toggleColorMode = () => undefined,
}: Props) => (
  <IconButton
    onClick={toggleColorMode}
    aria-label="カラーモードを切り替える"
    icon={colorMode === 'light' ? <FaRegMoon /> : <FaRegSun />}
  />
);
