import type { NextConfig } from "next";
import { version } from "./package.json";

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
  env: {
    NEXT_PUBLIC_FRONTEND_VERSION: version,
  },
};

export default nextConfig;
