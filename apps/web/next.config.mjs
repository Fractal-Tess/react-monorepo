import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

const allowedDevOrigins = [
  "vd.netbird.cloud",
  ...((process.env.NEXT_ALLOWED_DEV_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins,
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
