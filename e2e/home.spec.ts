import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("shows app title and API documentation", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Artifact" })).toBeVisible();
    await expect(page.getByText("Host HTML at")).toBeVisible();
    await expect(page.getByRole("heading", { name: "API" })).toBeVisible();
    await expect(page.getByText("POST /api/artifacts")).toBeVisible();
  });
});
