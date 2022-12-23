const path = require('path');
const withExportImages = require('next-export-optimize-images');
const withRoutes = require('nextjs-routes/config')();

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

module.exports = withRoutes(withExportImages(nextConfig));
