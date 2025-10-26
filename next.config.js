const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  webpack: (config) => {
    config.resolve.alias['@prisma/client'] = path.join(__dirname, 'stubs/prisma-client.ts');
    config.resolve.alias['swr'] = path.join(__dirname, 'stubs/swr.ts');
    config.resolve.alias['zod'] = path.join(__dirname, 'stubs/zod.ts');
    config.resolve.alias['recharts'] = path.join(__dirname, 'stubs/recharts.tsx');
    return config;
  }
};

module.exports = nextConfig;
