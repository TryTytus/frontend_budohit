import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'budohit.pl',
      },
    ],
  },
};

export default nextConfig;
