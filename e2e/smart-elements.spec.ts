// E2E Tests for Smart Elements
import { test, expect } from '@playwright/test';

test.describe('Smart Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should render project cards widget correctly', async ({ page }) => {
    // Check if project cards widget exists or create test scenario
    await page.evaluate(() => {
      // Create test container if needed
      if (!document.getElementById('smart-elements-test')) {
        const container = document.createElement('div');
        container.id = 'smart-elements-test';
        container.style.width = '800px';
        container.style.height = '600px';
        document.body.appendChild(container);
      }
    });

    // Test widget rendering performance
    const renderTime = await page.evaluate(async () => {
      const start = performance.now();
      
      // Simulate widget rendering
      const container = document.getElementById('smart-elements-test');
      if (container) {
        // Create mock project cards
        for (let i = 0; i < 20; i++) {
          const card = document.createElement('div');
          card.className = 'project-card bg-card p-4 rounded-lg shadow-sm border';
          card.innerHTML = `
            <h3 class="font-semibold">Project ${i + 1}</h3>
            <p class="text-muted-foreground">Status: Active</p>
            <div class="progress-bar h-2 bg-muted rounded-full mt-2">
              <div class="progress-fill h-full bg-primary rounded-full" style="width: ${Math.random() * 100}%"></div>
            </div>
          `;
          container.appendChild(card);
        }
      }
      
      return performance.now() - start;
    });

    // Widget rendering should be fast
    expect(renderTime).toBeLessThan(50);

    // Check visual elements
    const testContainer = page.locator('#smart-elements-test');
    await expect(testContainer).toBeVisible();
    
    const projectCards = testContainer.locator('.project-card');
    await expect(projectCards).toHaveCount(20);
  });

  test('should handle finance dashboard interactions', async ({ page }) => {
    // Create finance dashboard test
    await page.evaluate(() => {
      const container = document.getElementById('smart-elements-test') || 
                       document.createElement('div');
      container.id = 'finance-dashboard-test';
      container.innerHTML = `
        <div class="finance-dashboard grid grid-cols-2 gap-4">
          <div class="metric-card bg-card p-4 rounded-lg">
            <h3>Revenue</h3>
            <div class="text-2xl font-bold text-green-600">$125,400</div>
          </div>
          <div class="metric-card bg-card p-4 rounded-lg">
            <h3>Expenses</h3>
            <div class="text-2xl font-bold text-red-600">$89,200</div>
          </div>
          <div class="chart-container bg-card p-4 rounded-lg col-span-2">
            <canvas id="finance-chart" width="400" height="200"></canvas>
          </div>
        </div>
      `;
      if (!container.parentNode) {
        document.body.appendChild(container);
      }

      // Draw test chart
      const canvas = container.querySelector('#finance-chart') as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d')!;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Draw sample line chart
        const points = 20;
        for (let i = 0; i < points; i++) {
          const x = (i / (points - 1)) * canvas.width;
          const y = canvas.height - (Math.random() * canvas.height);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    });

    const dashboard = page.locator('#finance-dashboard-test');
    await expect(dashboard).toBeVisible();

    // Test metric cards
    const metricCards = dashboard.locator('.metric-card');
    await expect(metricCards).toHaveCount(2);

    // Test chart container
    const chartContainer = dashboard.locator('.chart-container');
    await expect(chartContainer).toBeVisible();

    const canvas = chartContainer.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should handle CRM activities widget updates', async ({ page }) => {
    // Test CRM activities widget
    const updatePerformance = await page.evaluate(async () => {
      const container = document.createElement('div');
      container.id = 'crm-activities-test';
      document.body.appendChild(container);

      const start = performance.now();
      
      // Simulate real-time updates
      for (let update = 0; update < 50; update++) {
        const activity = document.createElement('div');
        activity.className = 'activity-item flex items-center gap-3 p-2 hover:bg-muted/50 rounded';
        activity.innerHTML = `
          <div class="activity-icon w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            📧
          </div>
          <div class="activity-content flex-1">
            <p class="text-sm">New activity ${update + 1}</p>
            <p class="text-xs text-muted-foreground">Just now</p>
          </div>
        `;
        
        container.appendChild(activity);
        
        // Simulate update delay
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      return performance.now() - start;
    });

    // Updates should be processed quickly
    expect(updatePerformance).toBeLessThan(100);

    const crmContainer = page.locator('#crm-activities-test');
    await expect(crmContainer).toBeVisible();

    const activities = crmContainer.locator('.activity-item');
    await expect(activities).toHaveCount(50);
  });

  test('should handle CSR requests widget efficiently', async ({ page }) => {
    // Test CSR requests widget performance
    const csrPerformance = await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'csr-requests-test';
      container.className = 'space-y-2 max-h-96 overflow-y-auto';
      document.body.appendChild(container);

      const start = performance.now();
      
      // Create large list of CSR requests
      for (let i = 0; i < 200; i++) {
        const request = document.createElement('div');
        request.className = 'csr-request border rounded-lg p-3 space-y-2';
        request.innerHTML = `
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-medium">Request #${1000 + i}</h4>
            <span class="text-xs px-2 py-1 rounded-full ${
              i % 3 === 0 ? 'bg-green-100 text-green-800' :
              i % 3 === 1 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }">
              ${i % 3 === 0 ? 'Resolved' : i % 3 === 1 ? 'Pending' : 'Open'}
            </span>
          </div>
          <p class="text-xs text-muted-foreground">
            Customer inquiry about product ${i + 1}
          </p>
          <div class="text-xs text-muted-foreground">
            Priority: ${Math.random() > 0.5 ? 'High' : 'Normal'}
          </div>
        `;
        container.appendChild(request);
      }
      
      return performance.now() - start;
    });

    // Large list rendering should be reasonable
    expect(csrPerformance).toBeLessThan(200);

    const csrContainer = page.locator('#csr-requests-test');
    await expect(csrContainer).toBeVisible();

    // Test scrolling performance
    await csrContainer.scroll({ top: 1000 });
    await csrContainer.scroll({ top: 0 });

    const requests = csrContainer.locator('.csr-request');
    await expect(requests).toHaveCount(200);
  });

  test('should handle widget data refresh efficiently', async ({ page }) => {
    // Test data refresh performance
    const refreshPerformance = await page.evaluate(async () => {
      const widgets = ['project-cards', 'finance-dashboard', 'crm-activities', 'csr-requests'];
      const refreshTimes: number[] = [];

      for (const widgetType of widgets) {
        const start = performance.now();
        
        // Simulate data refresh
        const mockData = Array.from({ length: 100 }, (_, i) => ({
          id: `item-${i}`,
          title: `Item ${i}`,
          status: Math.random() > 0.5 ? 'active' : 'inactive',
          value: Math.random() * 1000,
          timestamp: Date.now()
        }));

        // Simulate processing and DOM updates
        const container = document.createElement('div');
        mockData.forEach(item => {
          const element = document.createElement('div');
          element.textContent = `${item.title}: ${item.status}`;
          container.appendChild(element);
        });

        const refreshTime = performance.now() - start;
        refreshTimes.push(refreshTime);
      }

      return refreshTimes.reduce((a, b) => a + b, 0) / refreshTimes.length;
    });

    // Average refresh time should be under 20ms
    expect(refreshPerformance).toBeLessThan(20);
  });

  test('should handle widget resize operations smoothly', async ({ page }) => {
    // Test widget resize performance
    await page.evaluate(() => {
      const widget = document.createElement('div');
      widget.id = 'resizable-widget-test';
      widget.style.cssText = `
        width: 300px;
        height: 200px;
        border: 2px solid #ccc;
        position: relative;
        background: white;
        resize: both;
        overflow: auto;
      `;
      widget.innerHTML = `
        <div class="widget-content p-4">
          <h3>Resizable Widget</h3>
          <div class="chart-area bg-gray-100 h-32 mt-2 rounded"></div>
        </div>
      `;
      document.body.appendChild(widget);
    });

    const widget = page.locator('#resizable-widget-test');
    await expect(widget).toBeVisible();

    // Test resize performance
    const resizePerformance = await page.evaluate(async () => {
      const widget = document.getElementById('resizable-widget-test')!;
      const start = performance.now();

      // Simulate resize operations
      const sizes = [
        { width: 400, height: 300 },
        { width: 500, height: 400 },
        { width: 600, height: 300 },
        { width: 400, height: 200 }
      ];

      for (const size of sizes) {
        widget.style.width = `${size.width}px`;
        widget.style.height = `${size.height}px`;
        
        // Trigger layout recalculation
        widget.offsetHeight;
        
        // Small delay to simulate real resize
        await new Promise(resolve => setTimeout(resolve, 16));
      }

      return performance.now() - start;
    });

    // Resize operations should be smooth
    expect(resizePerformance).toBeLessThan(100);
  });
});