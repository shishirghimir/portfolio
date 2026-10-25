import type { NextConfig } from "next";

// Fully static: every page is pre-rendered to HTML at build time, so search
// engines and AI crawlers get the complete content with no JavaScript needed.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
