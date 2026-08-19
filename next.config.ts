import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Cloudflare Pages serves the prebuilt static files; the Next.js image
    // optimization server is intentionally not part of this deployment model.
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
