import { expect, test } from "@playwright/test";

import { testCode } from "./helpers";

const sampleHtml =
  "<html><body><h1>E2E Hello</h1><p>artifact test</p></body></html>";

test.describe("artifacts API and pages", () => {
  test("creates artifact with auto-generated code and serves HTML", async ({
    request,
    page,
  }) => {
    const response = await request.post("/api/artifacts", {
      multipart: { html: sampleHtml },
    });

    expect(response.status()).toBe(201);

    const body = (await response.json()) as {
      uniquecode: string;
      url: string;
    };

    expect(body.uniquecode).toMatch(/^[A-Za-z0-9_-]{10}$/);
    expect(body.url).toContain(`/${body.uniquecode}`);

    await page.goto(`/${body.uniquecode}`);
    await expect(page.getByRole("heading", { name: "E2E Hello" })).toBeVisible();
    await expect(page.getByText("artifact test")).toBeVisible();
  });

  test("creates artifact with custom uniquecode", async ({ request, page }) => {
    const uniquecode = testCode("custom");

    const response = await request.post("/api/artifacts", {
      multipart: { uniquecode, html: sampleHtml },
    });

    expect(response.status()).toBe(201);

    const body = (await response.json()) as { uniquecode: string };
    expect(body.uniquecode).toBe(uniquecode);

    await page.goto(`/${uniquecode}`);
    await expect(page.getByRole("heading", { name: "E2E Hello" })).toBeVisible();
  });

  test("creates artifact from uploaded HTML file", async ({ request, page }) => {
    const uniquecode = testCode("file");

    const response = await request.post("/api/artifacts", {
      multipart: {
        uniquecode,
        html_file: {
          name: "page.html",
          mimeType: "text/html",
          buffer: Buffer.from(sampleHtml),
        },
      },
    });

    expect(response.status()).toBe(201);

    const body = (await response.json()) as { uniquecode: string };
    expect(body.uniquecode).toBe(uniquecode);

    await page.goto(`/${uniquecode}`);
    await expect(page.getByRole("heading", { name: "E2E Hello" })).toBeVisible();
  });

  test("rejects JSON content type", async ({ request }) => {
    const response = await request.post("/api/artifacts", {
      headers: { "Content-Type": "application/json" },
      data: { html: sampleHtml },
    });

    expect(response.status()).toBe(415);

    const body = (await response.json()) as { error: string };
    expect(body.error).toBe("Content-Type must be multipart/form-data");
  });

  test("returns 404 for unknown uniquecode", async ({ request }) => {
    const response = await request.get(`/${testCode("missing")}`);
    expect(response.status()).toBe(404);
  });

  test("rejects empty html", async ({ request }) => {
    const response = await request.post("/api/artifacts", {
      multipart: { html: "   " },
    });

    expect(response.status()).toBe(400);

    const body = (await response.json()) as { error: string };
    expect(body.error).toBe("html is required");
  });

  test("rejects invalid uniquecode", async ({ request }) => {
    const response = await request.post("/api/artifacts", {
      multipart: { uniquecode: "ab", html: sampleHtml },
    });

    expect(response.status()).toBe(400);

    const body = (await response.json()) as { error: string };
    expect(body.error).toContain("uniquecode must be 3-64 characters");
  });

  test("rejects duplicate uniquecode", async ({ request }) => {
    const uniquecode = testCode("dup");

    const first = await request.post("/api/artifacts", {
      multipart: { uniquecode, html: sampleHtml },
    });
    expect(first.status()).toBe(201);

    const second = await request.post("/api/artifacts", {
      multipart: {
        uniquecode,
        html: "<html><body>other</body></html>",
      },
    });
    expect(second.status()).toBe(409);

    const body = (await second.json()) as { error: string };
    expect(body.error).toBe("uniquecode already exists");
  });
});
