const path = require('path');
const withExportImages = require('next-export-optimize-images');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // https://jamband.github.io/blog/2021/08/deploy-nextjs-app-to-github-pages/
  trailingSlash: true,
  basePath: process.env.GITHUB_ACTIONS && '/seichi-portal-frontend',
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
