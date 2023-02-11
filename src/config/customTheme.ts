import { extendTheme } from '@chakra-ui/react';

export const customChakraTheme = extendTheme({
  breakPoints: {
    xl: '1440px',
    '2xl': '2560px',
  },
  components: {
    Container: {
      baseStyle: {
        maxW: {
          base: '60ch',
          md: '120ch',
        },
      },
    },
  },
});
