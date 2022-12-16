const path = require('path');
const withExportImages = require('next-export-optimize-images');

const urlPrefix = process.env.GITHUB_ACTIONS
  ? '/seichi-portal-frontend'
  : undefined;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    return config;
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
};

module.exports = withExportImages(nextConfig);
