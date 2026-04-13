import { expect, test } from "@playwright/test";

const LOGIN_URL_PATTERN = /\/login$/;

test("renders the landing page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("A minimal starter for apps, auth, workers & scraping.")
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Dashboard", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
});

test("renders the login page", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByText("Sign in to your account")).toBeVisible();
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
