import type { NextConfig } from "next";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  // The starter includes optional Cloudflare/D1 examples that are not part of
  // this static GitHub Pages build and use runtime-only module declarations.
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
