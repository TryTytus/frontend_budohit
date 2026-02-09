import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'budohit.pl',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/media/:path*',
        destination: 'http://127.0.0.1:8000/media/:path*',
      },
    ];
  },
};


export default nextConfig;
