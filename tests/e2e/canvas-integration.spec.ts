import { test, expect } from '@playwright/test';

test.describe('Canvas Integration Tests', () => {
  test('should load planning canvas with enhanced engine', async ({ page }) => {
    await page.goto('/operations/solidarity/planning');
    
    // Wait for canvas to load
    await expect(page.locator('[data-test-id="integrated-planning-canvas"]')).toBeVisible();
    
    // Check if enhanced engine is active
    await expect(page.locator('text=Canvas Engine نشط')).toBeVisible({ timeout: 10000 });
    
    // Verify enhanced sticky note is created
    await expect(page.locator('text=🚀 نظام محسّن')).toBeVisible({ timeout: 5000 });
  });

  test('should handle tool switching with canvas engine', async ({ page }) => {
    await page.goto('/operations/solidarity/planning');
    
    // Wait for canvas ready
    await page.waitForSelector('[data-test-id="btn-smart-tool-enhanced"]');
    
    // Test smart tool
    await page.press('body', 's');
    await expect(page.locator('[data-test-id="modal-smart-panel-enhanced"]')).toBeVisible();
    
    // Close panel
    await page.press('body', 'Escape');
    await expect(page.locator('[data-test-id="modal-smart-panel-enhanced"]')).not.toBeVisible();
  });

  test('should perform zoom operations with canvas engine', async ({ page }) => {
    await page.goto('/operations/solidarity/planning');
    
    // Wait for canvas ready
    await page.waitForSelector('[data-test-id="status-enhanced-realtime"]');
    
    // Test zoom in
    await page.keyboard.press('Control+Plus');
    
    // Check zoom level in status
    await expect(page.locator('text=/تكبير: [0-9.]+x/')).toBeVisible();
    
    // Test zoom reset
    await page.keyboard.press('Control+0');
  });

  test('should handle performance metrics', async ({ page }) => {
    await page.goto('/operations/solidarity/planning');
    
    // Wait for enhanced status
    await page.waitForSelector('text=⚡ محرك الأداء نشط');
    
    // Verify performance metrics are displayed
    await expect(page.locator('text=/عقد: [0-9]+/')).toBeVisible();
    await expect(page.locator('text=/تكبير: [0-9.]+x/')).toBeVisible();
  });

  test('should fallback to legacy system when engine unavailable', async ({ page }) => {
    // Simulate engine unavailability by navigating directly to old canvas
    await page.goto('/');
    
    // Navigate to planning section via sidebar
    await page.click('[data-section="planning"]');
    
    // Should still work with legacy system
    await expect(page.locator('[data-test-id="planning-workspace"]')).toBeVisible();
  });
});