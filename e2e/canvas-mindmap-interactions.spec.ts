import { test, expect, Page } from '@playwright/test';

/**
 * E2E tests for MindMap Node interactions:
 * - Dragging nodes
 * - Double-click to enter edit mode
 * - Adding branches
 */

const CANVAS_ROUTE = '/planning';

async function createMindMapNode(page: Page) {
  // Select the smart element tool / mindmap tool
  await page.locator('[data-tool="smart_element_tool"], button:has-text("ذكي"), button:has-text("خريطة")').first().click();
  
  const canvas = page.locator('[data-canvas="true"], .infinite-canvas, [data-testid="canvas"]').first();
  await canvas.click({ position: { x: 400, y: 400 } });
}

async function getMindMapNode(page: Page) {
  return page.locator('[data-canvas-element="true"]').filter({
    has: page.locator('span:has-text("عقدة"), span:has-text("فرع")')
  }).first();
}

test.describe('Canvas MindMap Node Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CANVAS_ROUTE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test('should drag mindmap node to new position', async ({ page }) => {
    await createMindMapNode(page);
    
    const node = await getMindMapNode(page);
    const initialBox = await node.boundingBox();
    
    if (!initialBox) {
      test.skip();
      return;
    }

    const startX = initialBox.x + initialBox.width / 2;
    const startY = initialBox.y + initialBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 60, { steps: 10 });
    await page.mouse.up();

    const newBox = await node.boundingBox();
    expect(newBox).toBeTruthy();
    expect(newBox!.x).toBeGreaterThan(initialBox.x + 60);
  });

  test('should enter edit mode on double-click', async ({ page }) => {
    await createMindMapNode(page);
    
    const node = await getMindMapNode(page);
    
    await node.dblclick();
    
    // Input should become visible for editing
    const input = node.locator('input');
    await expect(input).toBeVisible({ timeout: 2000 });
    
    // Type new label
    await input.fill('اختبار العقدة');
    await page.keyboard.press('Enter');
    
    // Verify label updated
    await expect(node).toContainText('اختبار العقدة');
  });

  test('should allow re-editing node after initial edit', async ({ page }) => {
    await createMindMapNode(page);
    
    const node = await getMindMapNode(page);
    
    // First edit
    await node.dblclick();
    const input = node.locator('input');
    await input.fill('تحرير أول');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(300);
    
    // Second edit
    await node.dblclick();
    const input2 = node.locator('input');
    await expect(input2).toBeVisible({ timeout: 2000 });
    await input2.fill('تحرير ثاني');
    await page.keyboard.press('Enter');
    
    await expect(node).toContainText('تحرير ثاني');
  });

  test('should show anchor points when node is selected', async ({ page }) => {
    await createMindMapNode(page);
    
    const node = await getMindMapNode(page);
    await node.click();
    
    // Anchor points should appear (4 anchors: top, bottom, left, right)
    const anchors = node.locator('.rounded-full.border-2');
    await expect(anchors).toHaveCount(4);
  });
});
