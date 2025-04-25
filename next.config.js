/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/taxmonster',
  trailingSlash: true,
};

module.exports = nextConfig; 