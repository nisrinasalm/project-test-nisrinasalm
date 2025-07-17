import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["assets.suitdev.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/ideas",
        destination: "https://suitmedia-backend.suitdev.com/api/ideas",
      },
    ];
  },
};

export default nextConfig;
