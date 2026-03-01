/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  turbopack: false,
  experimental: {
    turbo: false,
  },
};

module.exports = nextConfig;