import { resolve } from 'path';
import type { StorybookConfig } from '@storybook/react/types';
import type { Configuration } from 'webpack';

const settings: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-coverage',
      options: {
        istanbul: {
          include: ['src/**/components/**/**.tsx'],
        },
      },
    },
    'storybook-addon-next',
    '@chakra-ui/storybook-addon',
  ],
  features: {
    emotionAlias: false,
    interactionsDebugger: true,
  },
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config: Configuration) => {
    const replacedConfig: Configuration = {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@': resolve(__dirname, '../src'),
        },
        fallback: {
          ...config.resolve?.fallback,
          stream: require.resolve('stream-browserify'),
        },
      },
    };

    return replacedConfig;
  },
};

export default settings;
