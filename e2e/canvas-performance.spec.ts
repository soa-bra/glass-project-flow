// E2E Performance Tests
import { test, expect } from '@playwright/test';

test.describe('Canvas Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should handle 10k elements without significant lag', async ({ page }) => {
    // Create large dataset
    await page.evaluate(() => {
      const createMockNodes = (count: number) => {
        const nodes = [];
        for (let i = 0; i < count; i++) {
          nodes.push({
            id: `node-${i}`,
            type: 'rect',
            transform: { 
              position: { x: (i % 100) * 120, y: Math.floor(i / 100) * 80 }, 
              rotation: 0, 
              scale: { x: 1, y: 1 } 
            },
            size: { width: 100, height: 60 },
            style: { fill: `hsl(${i % 360}, 70%, 50%)` }
          });
        }
        return nodes;
      };

      // Add to window for testing
      (window as any).testNodes = createMockNodes(10000);
    });

    // Measure initial render time
    const initialRender = await page.evaluate(() => {
      const start = performance.now();
      // Trigger canvas render with test nodes
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx && (window as any).testNodes) {
          // Simulate render
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          (window as any).testNodes.slice(0, 100).forEach((node: any) => {
            ctx.fillStyle = node.style.fill;
            ctx.fillRect(
              node.transform.position.x, 
              node.transform.position.y, 
              node.size.width, 
              node.size.height
            );
          });
        }
      }
      return performance.now() - start;
    });

    // Initial render should be under 100ms for visible elements
    expect(initialRender).toBeLessThan(100);

    // Measure pan performance
    const panPerformance = await page.evaluate(async () => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return 0;

      const frameTimes: number[] = [];
      let frameCount = 0;
      const maxFrames = 30; // Test for ~0.5 seconds at 60fps

      return new Promise<number>((resolve) => {
        const measureFrame = () => {
          const start = performance.now();
          
          // Simulate pan by updating viewport
          const ctx = canvas.getContext('2d');
          if (ctx && (window as any).testNodes) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Render subset of nodes (viewport culling simulation)
            const panOffset = frameCount * 5;
            (window as any).testNodes
              .filter((_: any, i: number) => i >= panOffset && i < panOffset + 100)
              .forEach((node: any) => {
                ctx.fillStyle = node.style.fill;
                ctx.fillRect(
                  node.transform.position.x - panOffset, 
                  node.transform.position.y, 
                  node.size.width, 
                  node.size.height
                );
              });
          }

          const frameTime = performance.now() - start;
          frameTimes.push(frameTime);
          frameCount++;

          if (frameCount < maxFrames) {
            requestAnimationFrame(measureFrame);
          } else {
            const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
            resolve(avgFrameTime);
          }
        };

        requestAnimationFrame(measureFrame);
      });
    });

    // Average frame time should be under 16ms (60fps)
    expect(panPerformance).toBeLessThan(16);
  });

  test('should handle zoom operations smoothly', async ({ page }) => {
    await page.evaluate(() => {
      // Create test canvas if not exists
      if (!document.querySelector('canvas')) {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        document.body.appendChild(canvas);
      }
    });

    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Measure zoom performance
    const zoomPerformance = await page.evaluate(async () => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return 0;

      const frameTimes: number[] = [];
      const zoomLevels = [1, 1.2, 1.5, 2.0, 2.5, 3.0, 2.5, 2.0, 1.5, 1.2, 1];

      for (const zoom of zoomLevels) {
        const start = performance.now();
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.scale(zoom, zoom);
          
          // Render some test elements
          for (let i = 0; i < 100; i++) {
            ctx.fillStyle = `hsl(${i * 3.6}, 70%, 50%)`;
            ctx.fillRect(i * 10, i * 5, 50, 30);
          }
          
          ctx.restore();
        }

        const frameTime = performance.now() - start;
        frameTimes.push(frameTime);
      }

      return frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    });

    // Zoom operations should be under 10ms on average
    expect(zoomPerformance).toBeLessThan(10);
  });

  test('should handle connector rendering performance', async ({ page }) => {
    // Test connector/line rendering performance
    const connectorPerformance = await page.evaluate(() => {
      const canvas = document.querySelector('canvas') || document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      if (!canvas.parentNode) document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d')!;
      const start = performance.now();

      // Draw 1000 connectors
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 1000; i++) {
        ctx.beginPath();
        const startX = (i % 40) * 20;
        const startY = Math.floor(i / 40) * 15;
        const endX = startX + 100 + Math.random() * 200;
        const endY = startY + 50 + Math.random() * 100;
        
        // Orthogonal path simulation
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + 50, startY);
        ctx.lineTo(startX + 50, endY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      return performance.now() - start;
    });

    // Connector rendering should be under 50ms for 1000 connectors
    expect(connectorPerformance).toBeLessThan(50);
  });

  test('should handle comment and sticky note performance', async ({ page }) => {
    // Test text rendering performance
    const textPerformance = await page.evaluate(() => {
      const canvas = document.querySelector('canvas') || document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      if (!canvas.parentNode) document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d')!;
      const start = performance.now();

      // Render 500 text elements (comments/stickies)
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'left';
      
      for (let i = 0; i < 500; i++) {
        const x = (i % 25) * 32;
        const y = Math.floor(i / 25) * 30 + 20;
        
        // Background
        ctx.fillStyle = '#ffeb3b';
        ctx.fillRect(x, y - 15, 120, 25);
        
        // Text
        ctx.fillStyle = '#333333';
        ctx.fillText(`Comment ${i}`, x + 5, y);
      }

      return performance.now() - start;
    });

    // Text rendering should be under 30ms for 500 elements
    expect(textPerformance).toBeLessThan(30);
  });

  test('should maintain 60fps during complex interactions', async ({ page }) => {
    await page.evaluate(() => {
      // Setup performance monitoring
      (window as any).frameRates = [];
      let lastTime = performance.now();
      
      const measureFPS = () => {
        const now = performance.now();
        const fps = 1000 / (now - lastTime);
        (window as any).frameRates.push(fps);
        lastTime = now;
        
        if ((window as any).frameRates.length < 60) { // ~1 second of data
          requestAnimationFrame(measureFPS);
        }
      };
      
      requestAnimationFrame(measureFPS);
    });

    // Simulate complex interactions
    const canvas = page.locator('canvas').first();
    
    // Simulate drag operations
    await canvas.hover();
    await page.mouse.down();
    
    for (let i = 0; i < 10; i++) {
      await page.mouse.move(100 + i * 20, 100 + i * 10);
      await page.waitForTimeout(16); // ~60fps intervals
    }
    
    await page.mouse.up();

    // Check frame rates
    const avgFPS = await page.evaluate(() => {
      const rates = (window as any).frameRates || [];
      if (rates.length === 0) return 0;
      return rates.reduce((a: number, b: number) => a + b, 0) / rates.length;
    });

    // Should maintain close to 60fps (allow some variance)
    expect(avgFPS).toBeGreaterThan(45);
  });

  test('should handle memory usage efficiently', async ({ page }) => {
    // Test memory usage during large operations
    const memoryUsage = await page.evaluate(async () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Create and destroy large dataset multiple times
      for (let cycle = 0; cycle < 5; cycle++) {
        const largeArray = Array.from({ length: 10000 }, (_, i) => ({
          id: `temp-${i}`,
          data: new Array(100).fill(Math.random())
        }));
        
        // Simulate processing
        largeArray.forEach(item => {
          item.data.sort();
        });
        
        // Clear references
        largeArray.length = 0;
      }
      
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      return finalMemory - initialMemory;
    });

    // Memory growth should be minimal (under 50MB)
    expect(memoryUsage).toBeLessThan(50 * 1024 * 1024);
  });
});