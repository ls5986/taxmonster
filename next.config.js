/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/taxmonster',
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(json)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = nextConfig; 