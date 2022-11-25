const path = require('path');
const withRoutes = require('nextjs-routes/config')();
const withExportImages = require('next-export-optimize-images');

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

module.exports = withExportImages(withRoutes(nextConfig));
