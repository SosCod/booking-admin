import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [];
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
