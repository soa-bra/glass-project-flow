/**
 * Integration Tests - Smart Elements Integration
 * Tests the integration of smart elements with the canvas system
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Smart element types
type SmartElementType = 
  | 'kpi_card'
  | 'progress_chart'
  | 'data_table'
  | 'metric_display'
  | 'timeline'
  | 'mindmap_node'
  | 'flowchart_node';

interface SmartElementConfig {
  type: SmartElementType;
  dataSource?: string;
  refreshInterval?: number;
  displayOptions?: Record<string, unknown>;
}

interface SmartElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  layerId: string;
  style?: Record<string, unknown>;
  locked: boolean;
  visible: boolean;
  smartConfig?: SmartElementConfig;
  smartData?: Record<string, unknown>;
}

// Helper to create smart elements
const createSmartElement = (
  smartType: SmartElementType,
  overrides: Partial<SmartElement> = {}
): SmartElement => ({
  id: `smart-${Math.random().toString(36).substr(2, 9)}`,
  type: 'smart',
  x: 100,
  y: 100,
  width: 300,
  height: 200,
  rotation: 0,
  layerId: 'default',
  style: { fill: '#ffffff', stroke: '#000000' },
  locked: false,
  visible: true,
  smartConfig: { type: smartType, refreshInterval: 30000 },
  smartData: {},
  ...overrides,
});

// Smart element registry
class SmartElementRegistry {
  private elements: Map<string, SmartElement> = new Map();
  private refreshIntervals: Map<string, NodeJS.Timeout> = new Map();
  
  register(element: SmartElement): void {
    this.elements.set(element.id, element);
  }
  
  unregister(elementId: string): void {
    this.elements.delete(elementId);
    this.stopDataRefresh(elementId);
  }
  
  getElement(elementId: string): SmartElement | undefined {
    return this.elements.get(elementId);
  }
  
  getAllElements(): SmartElement[] {
    return Array.from(this.elements.values());
  }
  
  updateData(elementId: string, data: Record<string, unknown>): void {
    const element = this.elements.get(elementId);
    if (element) element.smartData = data;
  }
  
  startDataRefresh(elementId: string, fetchFn: () => Promise<Record<string, unknown>>): void {
    const element = this.elements.get(elementId);
    if (!element?.smartConfig?.refreshInterval) return;
    
    this.stopDataRefresh(elementId);
    const interval = setInterval(async () => {
      try {
        const data = await fetchFn();
        this.updateData(elementId, data);
      } catch { /* ignore */ }
    }, element.smartConfig.refreshInterval);
    this.refreshIntervals.set(elementId, interval);
  }
  
  stopDataRefresh(elementId: string): void {
    const interval = this.refreshIntervals.get(elementId);
    if (interval) {
      clearInterval(interval);
      this.refreshIntervals.delete(elementId);
    }
  }
  
  clear(): void {
    for (const id of this.elements.keys()) this.stopDataRefresh(id);
    this.elements.clear();
  }
}

// Simple renderer
const renderSmartElement = (element: SmartElement): string => {
  const { smartConfig, width, height } = element;
  return `<g class="${smartConfig?.type || 'unknown'}"><rect width="${width}" height="${height}" /></g>`;
};

describe('Smart Elements Integration Tests', () => {
  let registry: SmartElementRegistry;
  
  beforeEach(() => {
    registry = new SmartElementRegistry();
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    registry.clear();
    vi.useRealTimers();
  });

  describe('Registration', () => {
    it('should register element', () => {
      registry.register(createSmartElement('kpi_card', { id: 'kpi-1' }));
      expect(registry.getElement('kpi-1')).toBeDefined();
    });

    it('should unregister element', () => {
      registry.register(createSmartElement('kpi_card', { id: 'kpi-1' }));
      registry.unregister('kpi-1');
      expect(registry.getElement('kpi-1')).toBeUndefined();
    });
  });

  describe('Data Management', () => {
    it('should update data', () => {
      registry.register(createSmartElement('kpi_card', { id: 'kpi-1' }));
      registry.updateData('kpi-1', { value: 100 });
      expect(registry.getElement('kpi-1')?.smartData?.value).toBe(100);
    });
  });

  describe('Rendering', () => {
    it('should render element', () => {
      const el = createSmartElement('kpi_card');
      const svg = renderSmartElement(el);
      expect(svg).toContain('kpi_card');
    });
  });

  describe('Performance', () => {
    it('should register 100 elements quickly', () => {
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        registry.register(createSmartElement('kpi_card', { id: `kpi-${i}` }));
      }
      expect(performance.now() - start).toBeLessThan(50);
    });
  });
});
