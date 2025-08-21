import { test, expect } from "@playwright/test";

test("export menu shows options", async ({ page }) => {
  await page.goto("/");
  await page.click("[data-testid=topbar-file]");
  await expect(page.getByText("تصدير PNG")).toBeVisible();
  await expect(page.getByText("تصدير SVG")).toBeVisible();
  await expect(page.getByText("تصدير PDF")).toBeVisible();
});
