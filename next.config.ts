import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/portfolio/pdf": ["./public/fonts/**"],
  },
};

export default nextConfig;
