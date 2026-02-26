import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/reserve-sandbox",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
