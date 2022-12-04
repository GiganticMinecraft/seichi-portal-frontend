const urlPrefix = process.env.GITHUB_ACTIONS
  ? '/seichi-portal-frontend'
  : undefined;

/** @type {import('next-export-optimize-images').Config} */
const config = {
  basePath: urlPrefix,
};

module.exports = config;
