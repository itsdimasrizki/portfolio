import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/portfolio/pdf": ["./public/fonts/**"],
  },
};

export default nextConfig;
