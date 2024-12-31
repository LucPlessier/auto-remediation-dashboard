/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Use SWC minifier for better performance
  swcMinify: true,
  // Force Vercel to use latest commit
  // Updated: 2024-12-31
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
