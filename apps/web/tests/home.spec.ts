import { expect, test } from "@playwright/test";

const LOGIN_URL_PATTERN = /\/login$/;

test("renders the landing page with Convex-backed preview data", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByText("A minimal starter for apps, auth, workers, and scraping.")
  ).toBeVisible();
  await expect(page.getByText("Deployment connected")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("Recent scrape runs")).toBeVisible();
  await expect(
    page.getByText("https://example.com", { exact: true })
  ).toBeVisible();
});

test("renders the login page", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByText("Login to your account")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sign in" }).first()
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create account" })
  ).toBeVisible();
});

test("redirects signed-out users away from the dashboard", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(LOGIN_URL_PATTERN);
});
