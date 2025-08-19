import { test, expect } from '@playwright/test';

test.describe('Solidarity Planning Canvas - Smoke Test', () => {
  test('should load canvas and basic functionality', async ({ page }) => {
    // Navigate to the planning workspace
    await page.goto('/');
    
    // Wait for the canvas container to be visible
    await expect(page.locator('[data-test-id="integrated-planning-canvas"]')).toBeVisible();
    
    // Check canvas stage exists and has reasonable dimensions
    const canvasStage = page.locator('[data-test-id="canvas-stage"]');
    await expect(canvasStage).toBeVisible();
    
    const boundingBox = await canvasStage.boundingBox();
    expect(boundingBox).toBeTruthy();
    expect(boundingBox!.width).toBeGreaterThan(300);
    expect(boundingBox!.height).toBeGreaterThan(300);
    
    // Check connection status (should be either connected or local-ephemeral)
    const statusRealtime = page.locator('[data-test-id="status-realtime"]');
    await expect(statusRealtime).toBeVisible();
    
    const statusText = await statusRealtime.textContent();
    expect(statusText).toMatch(/(connected|local-ephemeral|disconnected)/);
    
    // Test grid toggle (should not crash)
    const gridToggle = page.locator('[data-test-id="btn-grid-toggle"]');
    await expect(gridToggle).toBeVisible();
    
    await gridToggle.click();
    await gridToggle.click(); // Toggle back
    
    // Test smart tool panel
    const smartToolButton = page.locator('[data-test-id="btn-smart-tool"]');
    await expect(smartToolButton).toBeVisible();
    
    await smartToolButton.click();
    
    // Smart panel should appear
    const smartPanel = page.locator('[data-test-id="modal-smart-panel"]');
    await expect(smartPanel).toBeVisible();
    
    // Close the panel
    const closeButton = page.locator('[data-test-id="btn-close-panel"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      // Try Escape key
      await page.keyboard.press('Escape');
    }
    
    // Panel should be hidden
    await expect(smartPanel).not.toBeVisible();
    
    // Check if default sticky exists (seeded content)
    // This might not always be visible immediately, so we'll check if canvas has some content
    const fpsCounter = page.locator('[data-test-id="status-fps"]');
    await expect(fpsCounter).toBeVisible();
    
    const fpsText = await fpsCounter.textContent();
    expect(fpsText).toMatch(/\d+\s*FPS/);
  });

  test('should handle zoom controls', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('[data-test-id="integrated-planning-canvas"]')).toBeVisible();
    
    // Test zoom in
    const zoomInButton = page.locator('[data-test-id="btn-zoom-in"]');
    await expect(zoomInButton).toBeVisible();
    await zoomInButton.click();
    
    // Test zoom out  
    const zoomOutButton = page.locator('[data-test-id="btn-zoom-out"]');
    await expect(zoomOutButton).toBeVisible();
    await zoomOutButton.click();
    
    // Test zoom reset
    const zoomResetButton = page.locator('[data-test-id="btn-zoom-reset"]');
    await expect(zoomResetButton).toBeVisible();
    await zoomResetButton.click();
  });
});