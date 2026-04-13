import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: repoRoot,
  },
  transpilePackages: [
    "@workspace/convex",
    "@workspace/shared",
    "@workspace/ui",
  ],
};

export default nextConfig;
