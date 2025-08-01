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
  allowedDevOrigins: ["localhost:3000", "192.168.29.231"],
};

export default nextConfig;
