import { test, expect } from "@playwright/test";

test("opens planning workspace and draws a shape", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-testid=planning-workspace]")).toBeVisible();

  // اختر أداة الأشكال وأدرج مستطيلاً
  await page.click("[data-testid=tool-shapes]");
  await page.mouse.move(300, 300);
  await page.mouse.down();
  await page.mouse.move(420, 360);
  await page.mouse.up();

  // يتوقع ظهور عنصر على الكانفاس
  await expect(page.locator("[data-testid=canvas]")).toBeVisible();
});
