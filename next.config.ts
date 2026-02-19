import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable API routes with database
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
