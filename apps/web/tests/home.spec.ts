import { expect, test } from "@playwright/test";

const SHARED_LIBRARY_TEXT = /shared example library/i;

test("renders the Convex-backed homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Workspace ready")).toBeVisible();
  await expect(page.getByText(SHARED_LIBRARY_TEXT)).toBeVisible();
  await expect(page.getByText("Convex")).toBeVisible();

  await expect(page.getByText("Deployment connected")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("Recent scrape runs")).toBeVisible();
  await expect(page.getByText("https://example.com")).toBeVisible();
});
