/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
<<<<<<< HEAD
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
=======
  experimental: {
    typedRoutes: true
>>>>>>> origin/main
  }
};

module.exports = nextConfig;
