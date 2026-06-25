import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders blank", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading")).toHaveCount(0);
    await expect(page.locator("body")).toHaveText("");
  });
});
