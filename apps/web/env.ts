import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CONVEX_SITE_URL: z.url(),
    CONVEX_URL: z.url(),
    NEXT_ALLOWED_DEV_ORIGINS: z.string().optional(),
    PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: z.string().optional(),
  },
  experimental__runtimeEnv: process.env,
});
