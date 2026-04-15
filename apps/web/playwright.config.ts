import { defineConfig, devices } from "@playwright/test";

import { env } from "./env";

const port = 3000;
const chromiumExecutablePath = env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const appOrigin = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: appOrigin,
    trace: "on-first-retry",
  },
  webServer: {
    command: `bun run dev -- --port ${port} --hostname 127.0.0.1`,
    port,
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: chromiumExecutablePath
          ? {
              executablePath: chromiumExecutablePath,
            }
          : undefined,
      },
    },
  ],
});
