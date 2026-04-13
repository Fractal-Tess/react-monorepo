import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

import { env } from "./env";

const repoRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

const allowedDevOrigins = [
  "127.0.0.1",
  "localhost",
  "vd.netbird.cloud",
  ...((env.NEXT_ALLOWED_DEV_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)),
];

const nextConfig: NextConfig = {
  allowedDevOrigins,
  transpilePackages: [
    "@workspace/convex",
    "@workspace/shared",
    "@workspace/ui",
  ],
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
