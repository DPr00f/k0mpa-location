/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  async rewrites() {
    return [
      {
        source: "/tiles/:path*",
        destination: "https://tiles.stadiamaps.com/tiles/alidade_smooth/:path*",
      },
    ];
  },
};

export default config;
