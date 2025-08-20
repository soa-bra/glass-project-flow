import { test, expect } from '@playwright/test';

test.describe('Solidarity Planning Canvas - Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to planning workspace
    await page.goto('/operations/solidarity/planning');
  });

  test('should display canvas and basic smart elements functionality', async ({ page }) => {
    // Check if integrated planning canvas is present
    const canvas = page.locator('[data-test-id="integrated-planning-canvas"]');
    await expect(canvas).toBeVisible();

    // Check if canvas stage is present
    const canvasStage = page.locator('[data-test-id="canvas-stage"]');
    await expect(canvasStage).toBeVisible();

    // Click smart tool button
    const smartToolBtn = page.locator('[data-test-id="btn-smart-tool"]');
    await expect(smartToolBtn).toBeVisible();
    await smartToolBtn.click();

    // Check if smart panel opens
    const smartPanel = page.locator('[data-test-id="modal-smart-panel"]');
    await expect(smartPanel).toBeVisible();

    // Look for any smart element button (should have at least basic elements)
    const elementButtons = page.locator('[data-test-id="modal-smart-panel"] button');
    await expect(elementButtons.first()).toBeVisible();

    // Try to click first available element (if any)
    const firstElement = elementButtons.first();
    if (await firstElement.isVisible()) {
      await firstElement.click();
      
      // Panel should close after selection
      await expect(smartPanel).not.toBeVisible();
    }

    // Test close panel with close button
    await smartToolBtn.click();
    await expect(smartPanel).toBeVisible();
    
    const closeBtn = page.locator('[data-test-id="btn-close-panel"]');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await expect(smartPanel).not.toBeVisible();
    }

    // Test close with Escape key
    await smartToolBtn.click();
    await expect(smartPanel).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(smartPanel).not.toBeVisible();
  });

  test('should handle canvas interactions', async ({ page }) => {
    const canvasStage = page.locator('[data-test-id="canvas-stage"]');
    await expect(canvasStage).toBeVisible();

    // Test basic canvas interaction (click on canvas)
    await canvasStage.click({ position: { x: 200, y: 150 } });
    
    // Canvas should remain interactive
    await expect(canvasStage).toBeVisible();
  });
});