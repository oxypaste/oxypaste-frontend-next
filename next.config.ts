import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // matches /api/*
        destination: `${BACKEND_URL}/api/:path*`, // proxy to backend
      },
    ];
  },
};

export default nextConfig;
