import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the page to be loaded
  await page.waitForLoadState('networkidle');
  
  // Check that the page title is present
  await expect(page).toHaveTitle(/SoaBra/);
});

test('navigation works correctly', async ({ page }) => {
  await page.goto('/');
  
  // Test basic navigation elements are present
  await expect(page.locator('nav')).toBeVisible();
});

test('performance metrics meet requirements', async ({ page }) => {
  await page.goto('/');
  
  // Measure performance
  const performanceTiming = await page.evaluate(() => {
    const timing = performance.timing;
    return {
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
    };
  });
  
  // TTI should be ≤ 2.5s (2500ms)
  expect(performanceTiming.loadTime).toBeLessThanOrEqual(2500);
});