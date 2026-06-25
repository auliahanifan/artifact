import { expect, test } from "@playwright/test";

import { testCode } from "./helpers";

const sampleHtml =
  "<html><body><h1>Input E2E</h1><p>from /input</p></body></html>";

test.describe("/input page", () => {
  test("shows login form when not authenticated", async ({ page }) => {
    await page.goto("/input");

    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.getByLabel("Username")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Create artifact" })).toHaveCount(0);
  });

  test("rejects invalid credentials", async ({ page }) => {
    await page.goto("/input");

    await page.getByLabel("Username").fill("wrong");
    await page.getByLabel("Password").fill("wrong");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid username or password")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  });

  test("logs in and creates artifact via form", async ({ page }) => {
    const uniquecode = testCode("input");

    await page.goto("/input");

    await page.getByLabel("Username").fill("aulia");
    await page.getByLabel("Password").fill("gantengpokoknya");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByRole("heading", { name: "Create artifact" })).toBeVisible();
    await expect(page.getByLabel("Unique code")).toBeVisible();
    await expect(page.getByLabel("HTML")).toBeVisible();

    await page.getByLabel("Unique code").fill(uniquecode);
    await page.getByLabel("HTML").fill(sampleHtml);
    await page.getByRole("button", { name: "Create artifact" }).click();

    await expect(page.getByText(`/${uniquecode}`)).toBeVisible();

    await page.goto(`/${uniquecode}`);
    await expect(page.getByRole("heading", { name: "Input E2E" })).toBeVisible();
    await expect(page.getByText("from /input")).toBeVisible();
  });

  test("logs out and returns to login form", async ({ page }) => {
    await page.goto("/input");

    await page.getByLabel("Username").fill("aulia");
    await page.getByLabel("Password").fill("gantengpokoknya");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByRole("heading", { name: "Create artifact" })).toBeVisible();

    await page.getByRole("button", { name: "Log out" }).click();

    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Create artifact" })).toHaveCount(0);
  });
});
