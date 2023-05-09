const path = require('path');
const withExportImages = require('next-export-optimize-images');
const { withSentryConfig } = require('@sentry/nextjs');

const rewrites = require('./src/generated/rewrites/out.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    /** @type {import('webpack').Configuration} */
    const replacedConfig = {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@': path.join(__dirname, 'src'),
        },
      },
    };

    return replacedConfig;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/GiganticMinecraft/**',
      },
    ],
  },
  sentry: {
    hideSourceMaps: true,
  },
  rewrites: async () => rewrites,
};

module.exports = withSentryConfig(withExportImages(nextConfig));
