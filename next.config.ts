import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://odin-blog-api-i8n5.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;