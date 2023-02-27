const path = require('path');

module.exports = {
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
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };
    config.resolve.fallback.stream = require.resolve('stream-browserify');

    return config;
  },
};
