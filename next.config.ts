import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Deploy host is memory-constrained (~2GB, shared with other services); source maps
  // measurably add to prerender memory for the 41 statically-generated project pages,
  // and aren't used here (no source map hosting/service set up for this site).
  productionBrowserSourceMaps: false,
  enablePrerenderSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
  },
};

export default nextConfig;
