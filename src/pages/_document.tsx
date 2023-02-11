import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

import { customChakraTheme } from '@/config';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="ja">
        <Head />
        <body>
          <ColorModeScript
            initialColorMode={customChakraTheme.config.initialColorMode}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
