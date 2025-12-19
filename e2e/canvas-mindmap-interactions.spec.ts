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

  test('should move anchor points when text size changes', async ({ page }) => {
    await createMindMapNode(page);
    
    const node = await getMindMapNode(page);
    await node.click();
    
    // Get initial anchor positions
    const anchors = node.locator('.rounded-full.border-2');
    await expect(anchors).toHaveCount(4);
    
    // Get the right anchor (should be on the right edge)
    const rightAnchor = anchors.nth(3); // right is typically last
    const initialAnchorBox = await rightAnchor.boundingBox();
    const initialNodeBox = await node.boundingBox();
    
    if (!initialAnchorBox || !initialNodeBox) {
      test.skip();
      return;
    }
    
    // Double-click to edit and add longer text
    await node.dblclick();
    const input = node.locator('input');
    await expect(input).toBeVisible({ timeout: 2000 });
    
    // Type a much longer text to expand the node
    await input.fill('نص طويل جداً لاختبار تمدد العقدة وتحريك نقاط الربط معها بشكل ديناميكي');
    await page.keyboard.press('Enter');
    
    // Wait for ResizeObserver to update
    await page.waitForTimeout(300);
    
    // Click to show anchors again
    await node.click();
    
    // Get new positions
    const newNodeBox = await node.boundingBox();
    const newRightAnchor = node.locator('.rounded-full.border-2').nth(3);
    const newAnchorBox = await newRightAnchor.boundingBox();
    
    expect(newNodeBox).toBeTruthy();
    expect(newAnchorBox).toBeTruthy();
    
    // Node should be wider now
    expect(newNodeBox!.width).toBeGreaterThan(initialNodeBox.width);
    
    // Right anchor should have moved further right
    expect(newAnchorBox!.x).toBeGreaterThan(initialAnchorBox.x);
  });

  test('anchor points should align with node edges after resize', async ({ page }) => {
    await createMindMapNode(page);
    
    const node = await getMindMapNode(page);
    
    // Edit with long text
    await node.dblclick();
    const input = node.locator('input');
    await input.fill('اختبار محاذاة النقاط على الحواف الحقيقية للعقدة');
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(300);
    await node.click();
    
    // Get node and anchor positions
    const nodeBox = await node.boundingBox();
    const anchors = node.locator('.rounded-full.border-2');
    
    if (!nodeBox) {
      test.skip();
      return;
    }
    
    // Check right anchor is at right edge (with tolerance for anchor size)
    const rightAnchor = anchors.nth(3);
    const rightAnchorBox = await rightAnchor.boundingBox();
    
    if (rightAnchorBox) {
      const anchorCenterX = rightAnchorBox.x + rightAnchorBox.width / 2;
      const nodeRightEdge = nodeBox.x + nodeBox.width;
      
      // Anchor center should be within 10px of node's right edge
      expect(Math.abs(anchorCenterX - nodeRightEdge)).toBeLessThan(10);
    }
    
    // Check bottom anchor is at bottom edge
    const bottomAnchor = anchors.nth(1);
    const bottomAnchorBox = await bottomAnchor.boundingBox();
    
    if (bottomAnchorBox) {
      const anchorCenterY = bottomAnchorBox.y + bottomAnchorBox.height / 2;
      const nodeBottomEdge = nodeBox.y + nodeBox.height;
      
      // Anchor center should be within 10px of node's bottom edge
      expect(Math.abs(anchorCenterY - nodeBottomEdge)).toBeLessThan(10);
    }
  });
});
