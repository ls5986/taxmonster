/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(json)$/,
      type: 'asset/resource',
    });
    return config;
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/taxmonster',
};

module.exports = nextConfig; 