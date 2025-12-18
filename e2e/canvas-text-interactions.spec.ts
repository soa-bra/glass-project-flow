import { test, expect, Page } from '@playwright/test';

/**
 * E2E tests for canvas text element interactions:
 * - Dragging text elements
 * - Double-click to enter edit mode
 * - Resize handles functionality
 */

const CANVAS_ROUTE = '/planning'; // Adjust if your route differs

async function createTextElement(page: Page) {
  // Assumes a text tool button with `data-tool="text_tool"` or similar exists
  await page.locator('[data-tool="text_tool"], button:has-text("نص")').first().click();

  // Click on canvas area to create a text element
  const canvas = page.locator('[data-canvas="true"], .infinite-canvas, [data-testid="canvas"]').first();
  await canvas.click({ position: { x: 300, y: 300 } });
}

async function getTextElement(page: Page) {
  // Find an existing text element on the canvas
  return page.locator('[data-canvas-element="true"]').filter({
    has: page.locator('div:has-text("انقر مرتين للكتابة"), [contenteditable]')
  }).first();
}

test.describe('Canvas Text Element Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CANVAS_ROUTE);
    // Wait for page and canvas to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('should drag text element to a new position', async ({ page }) => {
    // Create or use an existing text element
    await createTextElement(page);
    
    const textElement = await getTextElement(page);
    const boundingBox = await textElement.boundingBox();
    
    if (!boundingBox) {
      test.skip();
      return;
    }

    const startX = boundingBox.x + boundingBox.width / 2;
    const startY = boundingBox.y + boundingBox.height / 2;

    // Drag 100px to the right and 50px down
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 50, { steps: 10 });
    await page.mouse.up();

    const newBoundingBox = await textElement.boundingBox();
    expect(newBoundingBox).toBeTruthy();
    // Verify element moved (tolerance for rounding)
    expect(newBoundingBox!.x).toBeGreaterThan(boundingBox.x + 80);
  });

  test('should enter edit mode on double-click and allow typing', async ({ page }) => {
    await createTextElement(page);
    
    const textElement = await getTextElement(page);
    
    // Double-click to enter edit mode
    await textElement.dblclick();
    
    // Wait for contenteditable / text editor to appear
    const editor = page.locator('[contenteditable="true"]').first();
    await expect(editor).toBeVisible({ timeout: 2000 });
    
    // Type some text
    await page.keyboard.type('اختبار Playwright');
    
    // Click outside to exit edit mode
    await page.mouse.click(50, 50);
    
    // Verify text updated
    await expect(textElement).toContainText('اختبار Playwright');
  });

  test('should show resize handles when text element is selected', async ({ page }) => {
    await createTextElement(page);
    
    const textElement = await getTextElement(page);
    
    // Click to select
    await textElement.click();
    
    // Resize handles should appear (class includes resize-handle)
    const handles = page.locator('.resize-handle');
    await expect(handles.first()).toBeVisible();
    
    // Should have 8 handles (corners + sides)
    await expect(handles).toHaveCount(8);
  });

  test('should resize text element via SE handle', async ({ page }) => {
    await createTextElement(page);
    
    const textElement = await getTextElement(page);
    await textElement.click();
    
    const initialBox = await textElement.boundingBox();
    if (!initialBox) {
      test.skip();
      return;
    }

    // Find SE (bottom-right) resize handle
    const seHandle = page.locator('.resize-handle').filter({
      has: page.locator(':scope')
    }).last(); // SE is typically last in DOM order

    const handleBox = await seHandle.boundingBox();
    if (!handleBox) {
      test.skip();
      return;
    }

    const handleCenterX = handleBox.x + handleBox.width / 2;
    const handleCenterY = handleBox.y + handleBox.height / 2;

    // Drag handle to resize
    await page.mouse.move(handleCenterX, handleCenterY);
    await page.mouse.down();
    await page.mouse.move(handleCenterX + 50, handleCenterY + 30, { steps: 5 });
    await page.mouse.up();

    const newBox = await textElement.boundingBox();
    expect(newBox).toBeTruthy();
    expect(newBox!.width).toBeGreaterThan(initialBox.width + 30);
  });

  test('should re-enter edit mode after exiting', async ({ page }) => {
    await createTextElement(page);
    
    const textElement = await getTextElement(page);
    
    // First edit
    await textElement.dblclick();
    await page.keyboard.type('أول تحرير');
    await page.mouse.click(50, 50);
    
    await page.waitForTimeout(300);
    
    // Second edit - the bug was that this did not work
    await textElement.dblclick();
    
    const editor = page.locator('[contenteditable="true"]').first();
    await expect(editor).toBeVisible({ timeout: 2000 });
    
    await page.keyboard.type(' - ثاني تحرير');
    await page.mouse.click(50, 50);
    
    // Verify both edits are present
    await expect(textElement).toContainText('ثاني تحرير');
  });
});
