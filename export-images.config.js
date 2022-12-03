const urlPrefix = process.env.GITHUB_ACTIONS ? '/seichi-portal-frontend' : '';

/** @type {import('next-export-optimize-images').Config} */
const config = {
  basePath: urlPrefix,
  imageDir: `${urlPrefix}/_next/static/chunks/images`,
};

module.exports = config;
