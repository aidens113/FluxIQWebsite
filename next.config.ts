import type { NextConfig } from "next";

// The site is a static export: `next build` writes plain HTML, CSS, and JS to
// `out/`, so it can be served by any static host. Features that need a Node
// server (route handlers, ISR, the image optimizer) are unavailable by design.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactCompiler: true,
  trailingSlash: true,
};

export default nextConfig;
