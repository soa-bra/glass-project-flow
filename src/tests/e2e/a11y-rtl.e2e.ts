import { test, expect } from "@playwright/test";

test("rtl and a11y basics", async ({ page }) => {
  await page.goto("/");
  // html dir="rtl" موجود؟
  const dir = await page.getAttribute("html", "dir");
  expect(dir).toBe("rtl");

  // وجود حلقات تركيز
  await page.keyboard.press("Tab");
  const active = await page.evaluate(()=> document.activeElement?.getAttribute("data-testid"));
  expect(active).toBeTruthy();
});
