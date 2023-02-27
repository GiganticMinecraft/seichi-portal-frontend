const path = require('path');
const withExportImages = require('next-export-optimize-images');

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
  rewrites: async () => [
    {
      source: '/externalApi/xbl',
      destination: 'https://user.auth.xboxlive.com/user/authenticate',
    },
    {
      source: '/externalApi/xsts',
      destination: 'https://xsts.auth.xboxlive.com/xsts/authorize',
    },
    {
      source: '/externalApi/mcToken',
      destination:
        'https://api.minecraftservices.com/authentication/login_with_xbox',
    },
    {
      source: '/externalApi/mcOwn',
      destination: 'https://api.minecraftservices.com/entitlements/mcstore',
    },
    {
      source: '/externalApi/mcProfile',
      destination: 'https://api.minecraftservices.com/minecraft/profile',
    },
  ],
};

module.exports = withExportImages(nextConfig);
