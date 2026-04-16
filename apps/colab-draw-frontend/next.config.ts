import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  // @ts-expect-error - next 16+ removed this config but Vercel build might still rely on it
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
