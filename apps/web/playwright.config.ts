import { defineConfig, devices } from "@playwright/test";

const port = 3000;
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: "bun run dev",
    port,
    reuseExistingServer: true,
    timeout: 120_000,
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
