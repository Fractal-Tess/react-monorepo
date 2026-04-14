import type { NextjsOptions } from "convex/nextjs";

import { env } from "@/env";

export function getConvexSsrOptions(token?: string): NextjsOptions {
  return {
    skipConvexDeploymentUrlCheck: true,
    token,
    url: env.CONVEX_URL,
  };
}
