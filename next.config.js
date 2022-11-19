/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.resolve.alias['@'] = path.join(__dirname, 'pages');

    return config;
  },
};

module.exports = nextConfig;
