import {
  extendTheme,
  type ThemeConfig,
  type ComponentSingleStyleConfig,
} from '@chakra-ui/react';

const theme: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const containerStyle: ComponentSingleStyleConfig = {
  baseStyle: {
    maxW: {
      base: '60ch',
      md: '120ch',
    },
  },
};

export const customChakraTheme = extendTheme({
  ...theme,
  breakPoints: {
    xl: '1440px',
    '2xl': '2560px',
  },
  components: {
    Container: containerStyle,
  },
});
