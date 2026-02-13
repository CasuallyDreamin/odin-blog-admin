import type { NextConfig } from "next";
const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : process.env.NEXT_PUBLIC_BACKEND_URL;

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
